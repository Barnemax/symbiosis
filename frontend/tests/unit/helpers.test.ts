import { describe, it, expect, vi, afterEach } from 'vitest'
import { resolveMediaUrl } from '@/lib/helpers'

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('resolveMediaUrl', () => {
  it('prepends the API base URL to local /media/ paths', () => {
    vi.stubEnv('NEXT_PUBLIC_API_URL', 'http://localhost:8080')
    expect(resolveMediaUrl('/media/image/garrulus-glandarius.webp'))
      .toBe('http://localhost:8080/media/image/garrulus-glandarius.webp')
  })

  it('falls back to http://localhost:8080 when env var is not set', () => {
    delete process.env.NEXT_PUBLIC_API_URL
    expect(resolveMediaUrl('/media/audio/garrulus-glandarius.mp3'))
      .toBe('http://localhost:8080/media/audio/garrulus-glandarius.mp3')
  })

  it('returns external URLs unchanged', () => {
    const url = 'https://upload.wikimedia.org/wikipedia/commons/foo.jpg'
    expect(resolveMediaUrl(url)).toBe(url)
  })

  it('returns xeno-canto audio URLs unchanged', () => {
    const url = 'https://xeno-canto.org/sounds/uploaded/foo.mp3'
    expect(resolveMediaUrl(url)).toBe(url)
  })
})
