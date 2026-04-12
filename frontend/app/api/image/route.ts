import { type NextRequest, NextResponse } from 'next/server'
import { requestHeaders } from '@/lib/strings/siteInfo'

export async function GET(req: NextRequest): Promise<NextResponse> {
  const url = req.nextUrl.searchParams.get('url')
  if (!url) {
    return new NextResponse('Missing url', { status: 400 })
  }
  if (!url.startsWith('https://upload.wikimedia.org/')) {
    return new NextResponse('Forbidden', { status: 403 })
  }

  const upstream = await fetch(url, {
    headers: { 'User-Agent': requestHeaders },
    next: { revalidate: 604800 }, // cache server-side for 1 week
  })
  if (!upstream.ok || !upstream.body) {
    return new NextResponse(`Upstream error ${upstream.status}`, { status: 502 })
  }

  return new NextResponse(upstream.body, {
    headers: {
      'Cache-Control': 'public, max-age=604800',
      'Content-Type': upstream.headers.get('Content-Type') ?? 'image/jpeg',
    },
  })
}
