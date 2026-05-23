import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const bodyInit: BodyInit = JSON.stringify({
    message: 'Hello, World!',
    request: request.nextUrl,
  });
  return new NextResponse(bodyInit);
}
