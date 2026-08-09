import ContactForm from '@/components/ContactForm'
import { getAllSpecies } from '@/lib/api'
import { getCommonName } from '@/lib/helpers'
import type { AppLocale } from '@/lib/types'
import { siteInfo } from '@/lib/strings/siteInfo'
import { getTranslations, getLocale } from 'next-intl/server'

export async function generateMetadata(): Promise<{ description: string; title: string }> {
  const t = await getTranslations('contact')
  return {
    description: t('subtitle'),
    title: `${t('title')} | ${siteInfo.name}`,
  }
}

export default async function ContactPage(): Promise<React.JSX.Element> {
  const [t, locale] = await Promise.all([
    getTranslations('contact'),
    getLocale(),
  ])

  const { member: species } = await getAllSpecies()

  const speciesOptions = species
    .map(s => {
      const common = getCommonName(s, locale as AppLocale)
      const label = common ? `${common} (${s.scientificName})` : s.scientificName
      return { label, value: label }
    })
    .sort((a, b) => a.label.localeCompare(b.label))

  return (
    <main className="mx-auto max-w-xl px-5 py-16 sm:px-8">
      <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">{t('title')}</h1>
      <p className="mt-3 text-base leading-relaxed text-ink-muted text-pretty">{t('subtitle')}</p>
      <div className="mt-10 border-t border-line pt-8">
        <ContactForm speciesOptions={speciesOptions} />
      </div>
    </main>
  )
}
