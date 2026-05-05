import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s Timeout

  try {
    const body = await request.json();
    const { trade, fullName, phone, username, password, role } = body;

    // Connect to our Fastify backend
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL || 'http://localhost:3001';

    const response = await fetch(`${backendUrl}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      body: JSON.stringify({
        full_name: fullName,       // Mapped to backend schema
        phone_number: phone,      // Mapped to backend schema
        username: username,
        trade: trade || 'Professional',
        password: password,
        role: role === 'pro' ? 'worker' : 'hirer'
      }),
    });

    clearTimeout(timeoutId);
    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || 'Registration failed' },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error: unknown) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      return NextResponse.json({ error: 'Server took too long to respond. Please try again.' }, { status: 504 });
    }
    console.error('Registration Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
