import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);

  try {
    const body = await request.json();
    const { trade, fullName, phone, username, password, role, birthday } = body;

    let backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    // If backendUrl is just a name like 'base', fallback to localhost or the known IP
    if (backendUrl === 'base') backendUrl = 'http://4.221.170.153:3001';
    
    console.log('[API/Register] Connecting to:', `${backendUrl}/auth/register`);

    const response = await fetch(`${backendUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        full_name: fullName,
        phone_number: phone,
        username,
        trade: trade || 'Professional',
        password,
        birthday: birthday || null,
        role: role === 'pro' ? 'worker' : 'hirer',
      }),
    });

    clearTimeout(timeoutId);
    console.log('[API/Register] Received response status:', response.status);
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
      return NextResponse.json(
        { error: 'Server took too long to respond. Please try again.' },
        { status: 504 }
      );
    }
    console.error('Registration Error:', error);
    return NextResponse.json(
      { error: 'Could not connect to the server. Please try again.' },
      { status: 500 }
    );
  }
}
