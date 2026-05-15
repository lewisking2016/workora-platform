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
    if (method !== 'GET' && method !== 'HEAD') {
      try {
        body = JSON.stringify(await request.json());
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

    return NextResponse.json(data);
  } catch (error) {
    console.error(`Proxy Error [${targetPath}]:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
