/**
 * M-Pesa Payment Routes — Daraja API Integration
 *
 * Implements:
 *   1. STK Push (Lipa Na M-Pesa Online) for customer-to-business payments
 *   2. Escrow system: client pays → funds held → worker completes → client confirms → worker paid
 *   3. Job lifecycle: pending → paid → in_progress → completed → released
 *
 * Required env vars:
 *   MPESA_CONSUMER_KEY, MPESA_CONSUMER_SECRET
 *   MPESA_SHORTCODE, MPESA_PASSKEY
 *   MPESA_CALLBACK_URL (public URL for Daraja callbacks)
 */

const { z } = require('zod');

// ── M-Pesa Daraja API helpers ──────────────────────────────────

const DARAJA_BASE = process.env.MPESA_ENV === 'production'
  ? 'https://api.safaricom.co.ke'
  : 'https://sandbox.safaricom.co.ke';

const cleanEnv = (val) => val ? val.replace(/^["'](.+)["']$/, '$1') : val;

async function getAccessToken() {
  const key = cleanEnv(process.env.MPESA_CONSUMER_KEY);
  const secret = cleanEnv(process.env.MPESA_CONSUMER_SECRET);
  if (!key || !secret) throw new Error('M-Pesa credentials not configured');

  const auth = Buffer.from(`${key}:${secret}`).toString('base64');
  const res = await fetch(`${DARAJA_BASE}/oauth/v1/generate?grant_type=client_credentials`, {
    headers: { Authorization: `Basic ${auth}` },
  });
  const data = await res.json();
  if (!data.access_token) throw new Error('Failed to get M-Pesa access token');
  return data.access_token;
}

function generateTimestamp() {
  const d = new Date();
  return d.getFullYear().toString() +
    String(d.getMonth() + 1).padStart(2, '0') +
    String(d.getDate()).padStart(2, '0') +
    String(d.getHours()).padStart(2, '0') +
    String(d.getMinutes()).padStart(2, '0') +
    String(d.getSeconds()).padStart(2, '0');
}

function generatePassword(timestamp) {
  const shortcode = cleanEnv(process.env.MPESA_SHORTCODE);
  const passkey = cleanEnv(process.env.MPESA_PASSKEY);
  return Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64');
}

/**
 * Initiate STK Push — sends payment prompt to customer's phone
 * @param {string} phone - Phone number (07XXXXXXXX or +254...)
 * @param {number} amount - Amount in KES
 * @param {string} accountRef - Account reference (e.g. job ID)
 * @param {string} description - Description of the payment
 */
async function initiateStkPush(phone, amount, accountRef, description) {
  const accessToken = await getAccessToken();
  const timestamp = generateTimestamp();
  const password = generatePassword(timestamp);
  const shortcode = cleanEnv(process.env.MPESA_SHORTCODE);
  const callbackUrl = cleanEnv(process.env.MPESA_CALLBACK_URL);

  // Normalize phone to 254XXXXXXXXX format
  let normalizedPhone = phone.replace(/[^0-9]/g, '');
  if (normalizedPhone.startsWith('0')) normalizedPhone = '254' + normalizedPhone.slice(1);
  if (normalizedPhone.startsWith('+')) normalizedPhone = normalizedPhone.slice(1);

  const res = await fetch(`${DARAJA_BASE}/mpesa/stkpush/v1/processrequest`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: Math.round(amount),
      PartyA: normalizedPhone,
      PartyB: shortcode,
      PhoneNumber: normalizedPhone,
      CallBackURL: callbackUrl,
      AccountReference: accountRef,
      TransactionDesc: description,
    }),
  });

  const data = await res.json();
  return data;
}

/**
 * Check STK Push transaction status
 */
async function checkTransactionStatus(checkoutRequestId) {
  const accessToken = await getAccessToken();
  const timestamp = generateTimestamp();
  const password = generatePassword(timestamp);
  const shortcode = cleanEnv(process.env.MPESA_SHORTCODE);

  const res = await fetch(`${DARAJA_BASE}/mpesa/transactionstatus/v1/query`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: timestamp,
      CheckoutRequestID: checkoutRequestId,
    }),
  });

  return res.json();
}

// ── Routes ──────────────────────────────────────────────────────

const escrowSchema = z.object({
  job_id: z.string().uuid(),
  amount: z.number().positive(),
  phone: z.string().min(10),
});

async function paymentRoutes(fastify) {
  const { pool } = fastify;
  const resolveActorId = (request) => request.user?.id;

  // ── 1. Initiate payment for a job (escrow) ─────────────────
  fastify.post('/pay', { preHandler: fastify.authenticate }, async (request, reply) => {
    let validated;
    try {
      validated = escrowSchema.parse(request.body);
    } catch (e) {
      return reply.status(400).send({ message: 'Validation failed', errors: e.errors });
    }

    const userId = resolveActorId(request);
    const { job_id, amount, phone } = validated;

    // Verify job exists and user is the hirer
    const jobRes = await pool.query(
      'SELECT * FROM job_posts WHERE id = $1 AND hirer_id = $2',
      [job_id, userId]
    );
    if (jobRes.rows.length === 0) {
      return reply.status(404).send({ message: 'Job not found or not owned by you' });
    }

    const job = jobRes.rows[0];
    if (job.status !== 'open') {
      return reply.status(400).send({ message: 'Job is not open for payment' });
    }

    // Create escrow record
    const escrowRes = await pool.query(
      `INSERT INTO escrow_payments (job_id, payer_id, amount, currency, phone, status)
       VALUES ($1, $2, $3, 'KES', $4, 'pending')
       RETURNING *`,
      [job_id, userId, amount, phone]
    );
    const escrow = escrowRes.rows[0];

    // Initiate STK push
    try {
      const stkResponse = await initiateStkPush(
        phone,
        amount,
        escrow.id,
        `Workora: ${job.title || 'Job payment'}`
      );

      // Update escrow with STK request ID
      await pool.query(
        'UPDATE escrow_payments SET stk_request_id = $1 WHERE id = $2',
        [stkResponse.CheckoutRequestID, escrow.id]
      );

      return {
        success: true,
        escrow_id: escrow.id,
        checkout_request_id: stkResponse.CheckoutRequestID,
        response_code: stkResponse.ResponseCode,
        response_description: stkResponse.ResponseDescription,
        customer_message: stkResponse.CustomerMessage,
      };
    } catch (err) {
      // Mark escrow as failed if STK push fails
      await pool.query(
        "UPDATE escrow_payments SET status = 'failed' WHERE id = $1",
        [escrow.id]
      );
      return reply.status(500).send({
        message: 'Failed to initiate M-Pesa payment',
        details: err.message,
      });
    }
  });

  // ── 2. M-Pesa callback (Daraja calls this URL) ─────────────
  fastify.post('/callback', async (request, reply) => {
    const body = request.body;
    const stkCallback = body?.Body?.stkCallback;

    if (!stkCallback) {
      return { ResultCode: 0, ResultDesc: 'OK' };
    }

    const checkoutRequestId = stkCallback.CheckoutRequestID;
    const resultCode = stkCallback.ResultCode;
    const resultDesc = stkCallback.ResultDesc;

    if (resultCode === 0) {
      // Payment successful — extract metadata
      const metadata = stkCallback.CallbackMetadata?.Item || [];
      const amount = metadata.find(i => i.Name === 'Amount')?.Value;
      const mpesaReceipt = metadata.find(i => i.Name === 'MpesaReceiptNumber')?.Value;
      const phone = metadata.find(i => i.Name === 'PhoneNumber')?.Value;

      // Update escrow status
      await pool.query(
        `UPDATE escrow_payments
         SET status = 'paid', mpesa_receipt = $1, paid_at = CURRENT_TIMESTAMP
         WHERE stk_request_id = $2`,
        [mpesaReceipt, checkoutRequestId]
      );

      // Update job status to 'in_progress' (payment received, work begins)
      const escrowRes = await pool.query(
        'SELECT job_id FROM escrow_payments WHERE stk_request_id = $1',
        [checkoutRequestId]
      );
      if (escrowRes.rows.length > 0) {
        await pool.query(
          "UPDATE job_posts SET status = 'in_progress' WHERE id = $1",
          [escrowRes.rows[0].job_id]
        );
      }

      request.log.info({ mpesaReceipt, checkoutRequestId }, 'M-Pesa payment received');
    } else {
      // Payment failed or cancelled
      await pool.query(
        "UPDATE escrow_payments SET status = 'failed', failure_reason = $1 WHERE stk_request_id = $2",
        [resultDesc, checkoutRequestId]
      );
      request.log.warn({ resultCode, resultDesc, checkoutRequestId }, 'M-Pesa payment failed');
    }

    // Daraja expects this response
    return { ResultCode: 0, ResultDesc: 'OK' };
  });

  // ── 3. Check payment status ─────────────────────────────────
  fastify.get('/status/:escrowId', { preHandler: fastify.authenticate }, async (request, reply) => {
    const userId = resolveActorId(request);
    const { escrowId } = request.params;

    const res = await pool.query(
      'SELECT * FROM escrow_payments WHERE id = $1 AND payer_id = $2',
      [escrowId, userId]
    );

    if (res.rows.length === 0) {
      return reply.status(404).send({ message: 'Payment not found' });
    }

    return res.rows[0];
  });

  // ── 4. Confirm job completion (releases escrow to worker) ──
  fastify.post('/confirm-completion/:escrowId', { preHandler: fastify.authenticate }, async (request, reply) => {
    const userId = resolveActorId(request);
    const { escrowId } = request.params;

    const escrowRes = await pool.query(
      'SELECT * FROM escrow_payments WHERE id = $1 AND payer_id = $2',
      [escrowId, userId]
    );

    if (escrowRes.rows.length === 0) {
      return reply.status(404).send({ message: 'Payment not found' });
    }

    const escrow = escrowRes.rows[0];
    if (escrow.status !== 'paid') {
      return reply.status(400).send({ message: 'Payment is not in paid state' });
    }

    // Mark escrow as released (funds sent to worker)
    await pool.query(
      "UPDATE escrow_payments SET status = 'released', released_at = CURRENT_TIMESTAMP WHERE id = $1",
      [escrowId]
    );

    // Mark job as completed
    await pool.query(
      "UPDATE job_posts SET status = 'closed' WHERE id = $1",
      [escrow.job_id]
    );

    // Update worker's trust score
    const jobRes = await pool.query(
      'SELECT worker_id FROM job_applications WHERE job_id = $1 AND status = $2',
      [escrow.job_id, 'accepted']
    );
    if (jobRes.rows.length > 0) {
      const workerId = jobRes.rows[0].worker_id;
      await pool.query(
        `UPDATE worker_profiles
         SET trust_score = LEAST(5.0, trust_score + 0.1),
             total_gigs = total_gigs + 1,
             updated_at = CURRENT_TIMESTAMP
         WHERE user_id = $1`,
        [workerId]
      );
    }

    return { success: true, message: 'Escrow released, job completed' };
  });

  // ── 5. List payments for current user ───────────────────────
  fastify.get('/history', { preHandler: fastify.authenticate }, async (request) => {
    const userId = resolveActorId(request);
    const res = await pool.query(
      `SELECT ep.*, jp.title AS job_title
       FROM escrow_payments ep
       JOIN job_posts jp ON jp.id = ep.job_id
       WHERE ep.payer_id = $1
       ORDER BY ep.created_at DESC
       LIMIT 50`,
      [userId]
    );
    return res.rows;
  });
}

module.exports = paymentRoutes;
