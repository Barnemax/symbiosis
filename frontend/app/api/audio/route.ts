import { type NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest): Promise<NextResponse> {
  const url = req.nextUrl.searchParams.get('url')
  if (!url) {
return new NextResponse('Missing url', { status: 400 })
}
  if (!url.startsWith('https://xeno-canto.org/')) {
return new NextResponse('Forbidden', { status: 403 })
}

  // Forward Range header to upstream so we don't buffer the entire file
  const upstreamHeaders: Record<string, string> = {}
  const rangeHeader = req.headers.get('Range')
  if (rangeHeader) {
    upstreamHeaders.Range = rangeHeader
  }

  const upstream = await fetch(url, { headers: upstreamHeaders })
  if (!upstream.ok && upstream.status !== 206) {
return new NextResponse('Upstream error', { status: 502 })
}

  const contentType = upstream.headers.get('Content-Type') ?? 'audio/mpeg'
  const responseHeaders: Record<string, string> = {
    'Accept-Ranges': 'bytes',
    'Content-Type': contentType,
  }

  // Pass through range-related headers from upstream
  const contentLength = upstream.headers.get('Content-Length')
  if (contentLength) {
    responseHeaders['Content-Length'] = contentLength
  }
  const contentRange = upstream.headers.get('Content-Range')
  if (contentRange) {
    responseHeaders['Content-Range'] = contentRange
  }
  if (upstream.status !== 206) {
    responseHeaders['Cache-Control'] = 'public, max-age=86400'
  }

  return new NextResponse(upstream.body, {
    headers: responseHeaders,
    status: upstream.status,
  })
}
