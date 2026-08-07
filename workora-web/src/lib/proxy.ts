import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getBackendBaseUrl } from './backend-url';

export async function proxyRequest(targetPath: string, request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    const backendUrl = getBackendBaseUrl();

    const url = `${backendUrl}${targetPath}`;
    const method = request.method;

    let body: BodyInit | undefined = undefined;
    let parsedBody: unknown = {};


    const contentType = request.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');

    if (method !== 'GET' && method !== 'HEAD') {
      if (isJson) {
        // Only JSON-parse when it's actually JSON
        parsedBody = await request.json().catch(() => ({}));
        body = JSON.stringify(parsedBody);
      } else {
        // Forward non-JSON bodies (multipart, form-data, etc.) as-is
        body = await request.arrayBuffer();
      }
    }

    const headers = new Headers(request.headers);

    // Replace content-type if we successfully parsed JSON.
    // Otherwise keep original content-type (important for uploads).
    if (isJson) {
      headers.set('content-type', 'application/json');
    }

    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }

    const response = await fetch(url, {
      method,
      headers,
      body,
    });

    const responseContentType = response.headers.get('content-type') || '';
    const isResponseJson = responseContentType.includes('application/json');

    const data = isResponseJson ? await response.json().catch(() => null) : null;

    if (!response.ok) {
      return NextResponse.json(
        { error: data?.message || 'Proxy request failed' },
        { status: response.status }
      );
    }

    // If login or register was successful, capture token and set cookie
    // (Backend returns { token, user: ... } for those endpoints)
    if (
      response.ok &&
      data?.token &&
      (targetPath.startsWith('/auth/login') || targetPath.startsWith('/auth/register'))
    ) {
      const rememberMe = (parsedBody as { rememberMe?: unknown } | null)?.rememberMe === true;

      const maxAge = rememberMe ? 60 * 60 * 24 * 30 : 60 * 60;

      const nextResponse = NextResponse.json(data);
      nextResponse.cookies.set({
        name: 'token',
        value: data.token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: maxAge,
        path: '/',
      });

      return nextResponse;
    }

    if (isResponseJson) {
      return NextResponse.json(data);
    }

    // Non-JSON response: return raw body
    const raw = await response.arrayBuffer();
    return new NextResponse(raw, { status: response.status });
  } catch (error) {
    console.error(`Proxy Error [${targetPath}]:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
