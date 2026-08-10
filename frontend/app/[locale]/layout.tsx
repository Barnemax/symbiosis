import type { Metadata } from 'next'
import '../globals.css'

import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { fontVariables } from '@/app/fonts'
import { routing } from '@/i18n/routing'
import { siteInfo } from '@/lib/strings/siteInfo'
import { THEME_INIT_SCRIPT } from '@/lib/theme'

/*
 * Root layout for the public site. It owns <html> so `lang` can follow the
 * route locale - which is also what lets these pages prerender: reading the
 * locale from params instead of headers keeps the tree static. Admin has its
 * own root layout at app/admin/layout.tsx.
 */

export const metadata: Metadata = {
  description: 'A nature encyclopedia exploring ecological relationships between birds, trees, and fungi.',
  title: {
    default: siteInfo.name,
    template: `%s | ${siteInfo.name}`,
  },
}

export function generateStaticParams(): { locale: string }[] {
  return routing.locales.map(locale => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}): Promise<React.JSX.Element> {
  const { locale } = await params

  if (!(routing.locales as readonly string[]).includes(locale)) {
    notFound()
  }

  // Must run before any getTranslations/getMessages call, otherwise next-intl
  // falls back to reading request headers and opts the route into SSR.
  setRequestLocale(locale)

  const messages = await getMessages()

  return (
    <html lang={locale} className={fontVariables} suppressHydrationWarning>
      <head>
        {/* Runs before paint so a dark-mode reload never flashes light. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
