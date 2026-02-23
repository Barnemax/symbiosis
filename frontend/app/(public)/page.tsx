import Link from 'next/link'

const KINGDOMS = [
  {
    description: 'Aves, feathered vertebrates',
    icon: '🪶',
    label: 'Birds',
    plural: 'birds',
  },
  {
    description: 'Woody plants and their ecology',
    icon: '🌳',
    label: 'Trees',
    plural: 'trees',
  },
  {
    description: 'Mycorrhizal and saprotrophic fungi',
    icon: '🍄',
    label: 'Fungi',
    plural: 'fungi',
  },
]

export default function HomePage(): React.JSX.Element {
  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="mb-2 text-3xl font-semibold text-stone-900">Symbiosis</h1>
      <p className="mb-8 text-stone-500">
        Explore relationships between species
      </p>
      <div className="grid gap-4 sm:grid-cols-3">
        {KINGDOMS.map(k => (
          <Link
            key={k.plural}
            href={`/${k.plural}`}
            className="group rounded-xl border border-stone-200 bg-white p-5 transition-shadow hover:shadow-md"
          >
            <div className="mb-2 text-2xl">{k.icon}</div>
            <h2 className="font-semibold text-stone-900 group-hover:text-stone-600">{k.label}</h2>
            <p className="mt-1 text-xs text-stone-400">{k.description}</p>
          </Link>
        ))}
      </div>
    </main>
  )
}
