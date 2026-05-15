require('dotenv').config();
const { S3Client, ListBucketsCommand } = require("@aws-sdk/client-s3");

async function testR2Connection() {
  console.log('Connecting to Cloudflare R2...');
  
  const s3 = new S3Client({
    region: "auto",
    endpoint: process.env.R2_ENDPOINT,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    },
  });

  try {
    const data = await s3.send(new ListBucketsCommand({}));
    console.log('✅ Cloudflare R2 connected successfully!');
    console.log('Found Buckets:', data.Buckets.map(b => b.Name).join(', '));
  } catch (err) {
    console.error('❌ Error connecting to R2:', err);
  }
}

testR2Connection();
