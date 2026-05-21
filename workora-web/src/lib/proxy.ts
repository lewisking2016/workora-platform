import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function proxyRequest(targetPath: string, request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    let backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    if (backendUrl === 'base') backendUrl = 'http://4.221.170.153:3001';

    const url = `${backendUrl}${targetPath}`;
    const method = request.method;
    
    let body = undefined;
    let parsedBody: any = {};
    if (method !== 'GET' && method !== 'HEAD') {
      try {
        parsedBody = await request.json();
        body = JSON.stringify(parsedBody);
      } catch {
        // Body might not be JSON or empty
      }
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      method,
      headers,
      body
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return NextResponse.json(
        { error: data?.message || 'Proxy request failed' },
        { status: response.status }
      );
    }

    const nextResponse = NextResponse.json(data);

    // If login or register was successful, capture token and set cookie
    if (response.ok && data?.token && (targetPath === '/auth/login' || targetPath === '/auth/register')) {
      const rememberMe = parsedBody?.rememberMe === true;
      const maxAge = rememberMe ? 60 * 60 * 24 * 30 : 60 * 60; // 30 days or 1 hour

      nextResponse.cookies.set({
        name: 'token',
        value: data.token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: maxAge,
        path: '/',
      });
    }

    return nextResponse;
  } catch (error) {
    console.error(`Proxy Error [${targetPath}]:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
