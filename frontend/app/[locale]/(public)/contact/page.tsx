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
    <main className="mx-auto max-w-lg px-6 py-12">
      <h1 className="mb-2 text-2xl font-semibold text-stone-900">{t('title')}</h1>
      <p className="mb-8 text-sm text-stone-500">{t('subtitle')}</p>
      <ContactForm speciesOptions={speciesOptions} />
    </main>
  )
}
