import type { Metadata } from 'next'
import './globals.css'

import { Fraunces, Instrument_Sans } from 'next/font/google'
import { siteInfo } from '@/lib/strings/siteInfo'
import { getLocale } from 'next-intl/server'
import { THEME_INIT_SCRIPT } from '@/lib/theme'

const fraunces = Fraunces({
  axes: ['SOFT', 'WONK'],
  display: 'swap',
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-fraunces',
})

const instrumentSans = Instrument_Sans({
  display: 'swap',
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-instrument-sans',
})

export const metadata: Metadata = {
  description: 'A nature encyclopedia exploring ecological relationships between birds, trees, and fungi.',
  title: {
    default: siteInfo.name,
    template: `%s | ${siteInfo.name}`,
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): Promise<React.JSX.Element> {
  const locale = await getLocale().catch(() => 'en')
  return (
    <html lang={locale} className={`${fraunces.variable} ${instrumentSans.variable}`} suppressHydrationWarning>
      <head>
        {/* Runs before paint so a dark-mode reload never flashes light. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
