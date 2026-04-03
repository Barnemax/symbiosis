'use server'

import { headers } from 'next/headers'
import { revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod/v4'
import { auth } from '@/lib/auth'
import { COMMON_NAME_LOCALES } from './constants'
import { API_URL } from './api'
import { pluralKingdom } from './helpers'
import type { Species } from './types'

import { siteInfo } from '@/lib/strings/siteInfo'

const API_KEY = process.env.ADMIN_PASSWORD ?? ''

const contactSchema = z.object({
  email: z.email('Please enter a valid email address'),
  message: z.string().min(1, 'Please enter a message').max(5000, 'Message is too long (max 5000 characters)'),
  speciesName: z.string().max(200).optional(),
  token: z.string().min(1, 'Please complete the captcha'),
})

function writeHeaders(contentType: string): Record<string, string> {
  return { Accept: 'application/ld+json', 'Content-Type': contentType, 'X-API-Key': API_KEY }
}

export async function login(
  _prevState: { error: string } | null,
  formData: FormData,
): Promise<{ error: string } | null> {
  const email = (formData.get('email') as string)?.trim()
  const password = formData.get('password') as string

  const res = await auth.api.signInEmail({ body: { email, password } })
  if (!res.user) {
    return { error: 'Incorrect email or password' }
  }

  redirect('/admin')
}

export async function logout(): Promise<void> {
  await auth.api.signOut({ headers: await headers() })
  redirect('/admin/login')
}

export async function createSpecies(
  _prevState: { error: string } | null,
  formData: FormData,
): Promise<{ error: string } | null> {
  const kingdom = formData.get('kingdom') as string
  const body: Record<string, unknown> = {
    conservationStatus: formData.get('conservationStatus') || null,
    family: `/api/families/${formData.get('familyId')}`,
    habitat: (formData.get('habitat') as string)?.trim() || null,
    scientificName: formData.get('scientificName'),
  }

  const commonNames = COMMON_NAME_LOCALES
    .map(locale => ({ locale, name: (formData.get(`cn_${locale}`) as string).trim() }))
    .filter(cn => cn.name.length > 0)
  if (commonNames.length > 0) {
    body.commonNames = commonNames
  }

  if (kingdom === 'bird' && formData.get('wingspan')) {
    body.wingspan = Number(formData.get('wingspan'))
  }
  if (kingdom === 'tree' && formData.get('maxHeight')) {
    body.maxHeight = Number(formData.get('maxHeight'))
  }
  if (kingdom === 'fungus') {
    const substrate = (formData.get('substrate') as string)?.trim() || null
    if (substrate) {
      body.substrate = substrate
    }
  }

  const res = await fetch(`${API_URL}/api/species`, {
    body: JSON.stringify(body),
    headers: writeHeaders('application/ld+json'),
    method: 'POST',
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { detail?: string }

    return { error: err.detail ?? `API error ${res.status}` }
  }

  const created = await res.json() as Species
  revalidateTag('species', { expire: 0 })
  const plural = pluralKingdom(kingdom)
  redirect(`/${plural}/${created.slug ?? created.id}`)
}

export async function updateSpecies(
  id: number,
  _prevState: { error: string } | null,
  formData: FormData,
): Promise<{ error: string } | null> {
  const kingdom = formData.get('kingdom') as string
  const body: Record<string, unknown> = {
    conservationStatus: formData.get('conservationStatus') || null,
    family: `/api/families/${formData.get('familyId')}`,
    habitat: (formData.get('habitat') as string)?.trim() || null,
    scientificName: formData.get('scientificName'),
  }

  const commonNames = COMMON_NAME_LOCALES
    .map(locale => ({ locale, name: (formData.get(`cn_${locale}`) as string).trim() }))
    .filter(cn => cn.name.length > 0)
  body.commonNames = commonNames

  if (kingdom === 'bird') {
    body.wingspan = formData.get('wingspan') ? Number(formData.get('wingspan')) : null
  }
  if (kingdom === 'tree') {
    body.maxHeight = formData.get('maxHeight') ? Number(formData.get('maxHeight')) : null
  }
  if (kingdom === 'fungus') {
    body.substrate = (formData.get('substrate') as string)?.trim() || null
  }

  const res = await fetch(`${API_URL}/api/species/${id}`, {
    body: JSON.stringify(body),
    headers: writeHeaders('application/merge-patch+json'),
    method: 'PATCH',
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { detail?: string }
    return { error: err.detail ?? `API error ${res.status}` }
  }

  const updated = await res.json() as Species
  revalidateTag('species', { expire: 0 })
  const plural = pluralKingdom(kingdom)
  redirect(`/${plural}/${updated.slug ?? updated.id}`)
}

export async function updateRelationship(
  id: number,
  _prevState: { error: string } | null,
  formData: FormData,
): Promise<{ error: string } | null> {
  const body = {
    notes: formData.get('notes') || null,
    object: `/api/species/${formData.get('objectId')}`,
    subject: `/api/species/${formData.get('subjectId')}`,
    type: formData.get('type'),
  }

  const res = await fetch(`${API_URL}/api/relationships/${id}`, {
    body: JSON.stringify(body),
    headers: writeHeaders('application/merge-patch+json'),
    method: 'PATCH',
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { detail?: string }
    return { error: err.detail ?? `API error ${res.status}` }
  }

  revalidateTag('relationships', { expire: 0 })
  redirect('/admin')
}

export async function sendContact(
  _prevState: { error: string; success?: never } | { success: string; error?: never } | null,
  formData: FormData,
): Promise<{ error: string; success?: never } | { success: string; error?: never } | null> {
  const parsed = contactSchema.safeParse({
    email: (formData.get('email') as string)?.trim(),
    message: (formData.get('message') as string)?.trim(),
    speciesName: (formData.get('speciesName') as string) || undefined,
    token: (formData.get('cf-turnstile-response') ?? '') as string,
  })
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }
  const { email, message, speciesName: species, token } = parsed.data

  const turnstileRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    body: JSON.stringify({ response: token, secret: process.env.TURNSTILE_SECRET_KEY }),
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
  })
  const turnstile = await turnstileRes.json() as { success: boolean }
  if (!turnstile.success) {
    return { error: 'Captcha verification failed' }
  }

  const subject = species
    ? `[${siteInfo.name}] ${species}`
    : `[${siteInfo.name}] Contact`

  const brevoRes = await fetch('https://api.brevo.com/v3/smtp/email', {
    body: JSON.stringify({
      replyTo: { email },
      sender: { email: process.env.CONTACT_SENDER_EMAIL, name: siteInfo.name },
      subject,
      textContent: species ? `From: ${email}\nSpecies: ${species}\n\n${message}` : `From: ${email}\n\n${message}`,
      to: [{ email: process.env.CONTACT_EMAIL }],
    }),
    headers: {
      'accept': 'application/json',
      'api-key': process.env.BREVO_API_KEY ?? '',
      'content-type': 'application/json',
    },
    method: 'POST',
  })

  if (!brevoRes.ok) {
    return { error: 'Failed to send message. Please try again later.' }
  }

  return { success: 'Message sent. Thank you!' }
}

export async function createRelationship(
  _prevState: { error: string } | null,
  formData: FormData,
): Promise<{ error: string } | null> {
  const body = {
    notes: formData.get('notes') || null,
    object: `/api/species/${formData.get('objectId')}`,
    subject: `/api/species/${formData.get('subjectId')}`,
    type: formData.get('type'),
  }

  const res = await fetch(`${API_URL}/api/relationships`, {
    body: JSON.stringify(body),
    headers: writeHeaders('application/ld+json'),
    method: 'POST',
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { detail?: string }
    return { error: err.detail ?? `API error ${res.status}` }
  }

  revalidateTag('relationships', { expire: 0 })
  redirect('/admin')
}

export async function updateSpeciesTranslation(
  id: number,
  _prevState: { error: string } | null,
  formData: FormData,
): Promise<{ error: string } | null> {
  const locale = formData.get('locale') as string
  const body = {
    habitat: (formData.get('habitat') as string)?.trim() || null,
    substrate: (formData.get('substrate') as string)?.trim() || null,
  }

  const res = await fetch(`${API_URL}/api/species/${id}/translations/${locale}`, {
    body: JSON.stringify(body),
    headers: writeHeaders('application/merge-patch+json'),
    method: 'PATCH',
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { detail?: string }
    return { error: err.detail ?? `API error ${res.status}` }
  }

  revalidateTag('species', { expire: 0 })
  return null
}

export async function updateRelationshipTranslation(
  id: number,
  _prevState: { error: string } | null,
  formData: FormData,
): Promise<{ error: string } | null> {
  const locale = formData.get('locale') as string
  const body = {
    notes: (formData.get('notes') as string)?.trim() || null,
  }

  const res = await fetch(`${API_URL}/api/relationships/${id}/translations/${locale}`, {
    body: JSON.stringify(body),
    headers: writeHeaders('application/merge-patch+json'),
    method: 'PATCH',
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { detail?: string }
    return { error: err.detail ?? `API error ${res.status}` }
  }

  revalidateTag('relationships', { expire: 0 })
  return null
}
