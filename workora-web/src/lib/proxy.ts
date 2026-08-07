import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getBackendBaseUrl } from './backend-url';

function readBearer(request: Request): string | null {
  const header = request.headers.get('authorization') || request.headers.get('Authorization');
  if (!header) return null;
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match?.[1]?.trim() || null;
}

export async function proxyRequest(targetPath: string, request: Request) {
  try {
    const cookieStore = await cookies();
    const cookieToken = cookieStore.get('token')?.value;
    const headerToken = readBearer(request);
    const token = cookieToken || headerToken;

    const backendUrl = getBackendBaseUrl();
    const url = `${backendUrl}${targetPath}`;
    const method = request.method;

    let body: BodyInit | undefined = undefined;
    let parsedBody: unknown = {};

    const contentType = request.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');

    if (method !== 'GET' && method !== 'HEAD') {
      if (isJson) {
        parsedBody = await request.json().catch(() => ({}));
        body = JSON.stringify(parsedBody);
      } else {
        body = await request.arrayBuffer();
      }
    }

    // Build clean outbound headers — never forward browser Host/Cookie/etc.
    const headers = new Headers();
    if (isJson) {
      headers.set('content-type', 'application/json');
    } else if (contentType) {
      headers.set('content-type', contentType);
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
        {
          error: data?.message || data?.error || 'Proxy request failed',
          message: data?.message || data?.error || 'Proxy request failed',
          code: data?.code,
          ...(data && typeof data === 'object' ? data : {}),
        },
        { status: response.status }
      );
    }

    const isAuthTokenPath =
      targetPath.startsWith('/auth/login') || targetPath.startsWith('/auth/register');

    if (isResponseJson && data?.token && isAuthTokenPath) {
      const rememberMe = (parsedBody as { rememberMe?: unknown } | null)?.rememberMe === true;
      // Presentation-friendly: 7 days default, 30 days with remember me
      const maxAge = rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24 * 7;

      const nextResponse = NextResponse.json(data);
      nextResponse.cookies.set({
        name: 'token',
        value: String(data.token),
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge,
        path: '/',
      });
      // Prevent CDN/edge from caching authenticated login responses
      nextResponse.headers.set('Cache-Control', 'no-store');
      return nextResponse;
    }

    if (isResponseJson) {
      const nextResponse = NextResponse.json(data);
      nextResponse.headers.set('Cache-Control', 'no-store');
      return nextResponse;
    }

    const raw = await response.arrayBuffer();
    return new NextResponse(raw, {
      status: response.status,
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (error) {
    console.error(`Proxy Error [${targetPath}]:`, error);
    return NextResponse.json({ error: 'Internal Server Error', message: 'Internal Server Error' }, { status: 500 });
  }
}
