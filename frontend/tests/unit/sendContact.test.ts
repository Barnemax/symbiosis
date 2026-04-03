import { beforeEach, describe, expect, it, vi } from 'vitest'
import { sendContact } from '@/lib/actions'

import { siteInfo } from '@/lib/strings/siteInfo'

const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

vi.stubEnv('TURNSTILE_SECRET_KEY', 'test-secret')
vi.stubEnv('BREVO_API_KEY', 'test-brevo-key')
vi.stubEnv('CONTACT_EMAIL', 'contact@example.com')
vi.stubEnv('CONTACT_SENDER_EMAIL', 'sender@example.com')

// Stub server-only imports that sendContact's module pulls in
vi.mock('next/cache', () => ({ revalidateTag: vi.fn() }))
vi.mock('next/navigation', () => ({ redirect: vi.fn() }))
vi.mock('next/server', () => ({}))
vi.mock('next/headers', () => ({ headers: vi.fn(() => new Headers()) }))
vi.mock('@/lib/auth', () => ({ auth: { api: { getSession: vi.fn(), signInEmail: vi.fn(), signOut: vi.fn() } } }))

function makeFormData(fields: Record<string, string>): FormData {
  const fd = new FormData()
  for (const [key, value] of Object.entries(fields)) {
    fd.set(key, value)
  }
  return fd
}

function turnstileSuccess(): object {
  return { json: () => Promise.resolve({ success: true }), ok: true }
}

function turnstileFailure(): object {
  return { json: () => Promise.resolve({ success: false }), ok: true }
}

function brevoSuccess(): object {
  return { json: () => Promise.resolve({}), ok: true }
}

function brevoFailure(): object {
  return { json: () => Promise.resolve({}), ok: false, status: 500 }
}

beforeEach(() => {
  mockFetch.mockReset()
})

describe('sendContact', () => {
  it('returns error when captcha token is missing', async () => {
    const result = await sendContact(null, makeFormData({ email: 'user@example.com', message: 'Hello' }))
    expect(result).toEqual({ error: 'Please complete the captcha' })
    expect(mockFetch).not.toHaveBeenCalled()
  })

  it('returns error when captcha verification fails', async () => {
    mockFetch.mockResolvedValueOnce(turnstileFailure())
    const result = await sendContact(null, makeFormData({
      'cf-turnstile-response': 'bad-token',
      'email': 'user@example.com',
      'message': 'Hello',
    }))
    expect(result).toEqual({ error: 'Captcha verification failed' })
  })

  it('returns error when message is empty', async () => {
    mockFetch.mockResolvedValueOnce(turnstileSuccess())
    const result = await sendContact(null, makeFormData({
      'cf-turnstile-response': 'good-token',
      'email': 'user@example.com',
      'message': '   ',
    }))
    expect(result).toEqual({ error: 'Please enter a message' })
  })

  it('sends email via Brevo and returns success', async () => {
    mockFetch
      .mockResolvedValueOnce(turnstileSuccess())
      .mockResolvedValueOnce(brevoSuccess())

    const result = await sendContact(null, makeFormData({
      'cf-turnstile-response': 'good-token',
      'email': 'user@example.com',
      'message': 'Great project!',
    }))

    expect(result).toEqual({ success: 'Message sent. Thank you!' })
    expect(mockFetch).toHaveBeenCalledTimes(2)

    const [brevoUrl, brevoInit] = mockFetch.mock.calls[1]
    expect(brevoUrl).toBe('https://api.brevo.com/v3/smtp/email')
    const body = JSON.parse(brevoInit.body)
    expect(body.subject).toBe(`[${siteInfo.name}] Contact`)
    expect(body.textContent).toBe('From: user@example.com\n\nGreat project!')
    expect(body.to).toEqual([{ email: 'contact@example.com' }])
  })

  it('includes species in subject and body when provided', async () => {
    mockFetch
      .mockResolvedValueOnce(turnstileSuccess())
      .mockResolvedValueOnce(brevoSuccess())

    await sendContact(null, makeFormData({
      'cf-turnstile-response': 'good-token',
      'email': 'user@example.com',
      'message': 'Wrong habitat listed',
      'speciesName': 'Eurasian Jay (Garrulus glandarius)',
    }))

    const body = JSON.parse(mockFetch.mock.calls[1][1].body)
    expect(body.subject).toBe(`[${siteInfo.name}] Eurasian Jay (Garrulus glandarius)`)
    expect(body.textContent).toContain('Species: Eurasian Jay (Garrulus glandarius)')
    expect(body.textContent).toContain('Wrong habitat listed')
  })

  it('returns error when Brevo API fails', async () => {
    mockFetch
      .mockResolvedValueOnce(turnstileSuccess())
      .mockResolvedValueOnce(brevoFailure())

    const result = await sendContact(null, makeFormData({
      'cf-turnstile-response': 'good-token',
      'email': 'user@example.com',
      'message': 'Hello',
    }))

    expect(result).toEqual({ error: 'Failed to send message. Please try again later.' })
  })

  it('passes Turnstile secret key in verification request', async () => {
    mockFetch
      .mockResolvedValueOnce(turnstileSuccess())
      .mockResolvedValueOnce(brevoSuccess())

    await sendContact(null, makeFormData({
      'cf-turnstile-response': 'my-token',
      'email': 'user@example.com',
      'message': 'Hello',
    }))

    const [turnstileUrl, turnstileInit] = mockFetch.mock.calls[0]
    expect(turnstileUrl).toBe('https://challenges.cloudflare.com/turnstile/v0/siteverify')
    const body = JSON.parse(turnstileInit.body)
    expect(body.response).toBe('my-token')
    expect(body.secret).toBe('test-secret')
  })
})
