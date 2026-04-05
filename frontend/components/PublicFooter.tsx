import { siteInfo } from '@/lib/strings/siteInfo'

const apiDocsUrl = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080') + '/api/docs'

export default function PublicFooter(): React.JSX.Element {
  return (
    <footer className="border-t border-stone-200 bg-white">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4 text-sm text-stone-400">
        <span>{siteInfo.name}</span>
        <div className="flex gap-4">
          <a
            href={siteInfo.githubRepo}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-stone-600 transition-colors"
          >
            GitHub
          </a>
          <a
            href={apiDocsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-stone-600 transition-colors"
          >
            API docs
          </a>
        </div>
      </div>
    </footer>
  )
}
