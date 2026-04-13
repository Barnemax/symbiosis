import type { Metadata } from 'next'
import './globals.css'

import { siteInfo } from '@/lib/strings/siteInfo'
import { getLocale } from 'next-intl/server'

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
    <html lang={locale}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Miranda+Sans:wght@100..900&display=swap" rel="stylesheet" />
      </head>
      <body
        className="antialiased"
      >
        {children}
      </body>
    </html>
  );
}
