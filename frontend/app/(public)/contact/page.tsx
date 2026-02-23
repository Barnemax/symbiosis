import ContactForm from '@/components/ContactForm'
import { getAllSpecies } from '@/lib/api'
import { getCommonName } from '@/lib/helpers'
import { siteInfo } from '@/lib/strings/siteInfo'

export const metadata = {
  description: 'Suggest a correction or get in touch',
  title: `Contact | ${siteInfo.name}`,
}

export default async function ContactPage(): Promise<React.JSX.Element> {
  const { member: species } = await getAllSpecies()

  const speciesOptions = species
    .map(s => {
      const common = getCommonName(s, 'en')
      const label = common ? `${common} (${s.scientificName})` : s.scientificName
      return { label, value: label }
    })
    .sort((a, b) => a.label.localeCompare(b.label))

  return (
    <main className="mx-auto max-w-lg px-6 py-12">
      <h1 className="mb-2 text-2xl font-semibold text-stone-900">Contact</h1>
      <p className="mb-8 text-sm text-stone-500">
        Spotted an error? Want to suggest a species? Just want to say hello? Drop us a message.
      </p>
      <ContactForm speciesOptions={speciesOptions} />
    </main>
  )
}
