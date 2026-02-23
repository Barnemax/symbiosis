import { describe, expect, it, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { GET } from '@/app/api/image/route'

import { siteInfo } from '@/lib/strings/siteInfo'

const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

function makeRequest(url: string): NextRequest {
  return new NextRequest(`http://localhost:3000/api/image?url=${encodeURIComponent(url)}`)
}

function makeRequestNoUrl(): NextRequest {
  return new NextRequest('http://localhost:3000/api/image')
}

beforeEach(() => {
  mockFetch.mockReset()
})

describe('GET /api/image', () => {
  it('returns 400 when url param is missing', async () => {
    const res = await GET(makeRequestNoUrl())
    expect(res.status).toBe(400)
    expect(await res.text()).toBe('Missing url')
  })

  it('returns 403 for non-Wikimedia URLs', async () => {
    const res = await GET(makeRequest('https://example.com/image.jpg'))
    expect(res.status).toBe(403)
    expect(mockFetch).not.toHaveBeenCalled()
  })

  it('returns 403 for URLs that only start similarly', async () => {
    const res = await GET(makeRequest('https://upload.wikimedia.org.evil.com/file.jpg'))
    expect(res.status).toBe(403)
  })

  it('proxies a valid Wikimedia URL and returns the image', async () => {
    const fakeBuffer = new ArrayBuffer(8)
    mockFetch.mockResolvedValueOnce({
      arrayBuffer: () => Promise.resolve(fakeBuffer),
      body: 'non-null',
      headers: { get: (h: string) => h === 'Content-Type' ? 'image/jpeg' : null },
      ok: true,
    })

    const res = await GET(makeRequest('https://upload.wikimedia.org/wikipedia/commons/a/ab/photo.jpg'))
    expect(res.status).toBe(200)
    expect(res.headers.get('Content-Type')).toBe('image/jpeg')
    expect(res.headers.get('Cache-Control')).toBe('public, max-age=604800')
  })

  it('passes the correct User-Agent header upstream', async () => {
    const fakeBuffer = new ArrayBuffer(4)
    mockFetch.mockResolvedValueOnce({
      arrayBuffer: () => Promise.resolve(fakeBuffer),
      body: 'non-null',
      headers: { get: () => 'image/png' },
      ok: true,
    })

    await GET(makeRequest('https://upload.wikimedia.org/wikipedia/commons/a/ab/photo.png'))
    expect(mockFetch).toHaveBeenCalledWith(
      'https://upload.wikimedia.org/wikipedia/commons/a/ab/photo.png',
      expect.objectContaining({
        headers: expect.objectContaining({ 'User-Agent': expect.stringContaining(siteInfo.name) }),
      }),
    )
  })

  it('returns 502 when upstream fetch fails', async () => {
    mockFetch.mockResolvedValueOnce({ body: null, ok: false, status: 404 })
    const res = await GET(makeRequest('https://upload.wikimedia.org/wikipedia/commons/a/ab/photo.jpg'))
    expect(res.status).toBe(502)
  })

  it('falls back to image/jpeg when upstream omits Content-Type', async () => {
    const fakeBuffer = new ArrayBuffer(4)
    mockFetch.mockResolvedValueOnce({
      arrayBuffer: () => Promise.resolve(fakeBuffer),
      body: 'non-null',
      headers: { get: () => null },
      ok: true,
    })

    const res = await GET(makeRequest('https://upload.wikimedia.org/wikipedia/commons/a/ab/photo.jpg'))
    expect(res.headers.get('Content-Type')).toBe('image/jpeg')
  })
})
