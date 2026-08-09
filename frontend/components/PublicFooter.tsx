import { SymbiosisMark } from '@/components/icons'
import { siteInfo } from '@/lib/strings/siteInfo'

const apiDocsUrl = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080') + '/api/docs'

export default function PublicFooter(): React.JSX.Element {
  return (
    <footer className="mt-24 border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-8 text-sm text-ink-faint sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <span className="flex items-center gap-2 font-display tracking-tight">
          <SymbiosisMark className="h-4 w-4" />
          {siteInfo.name}
        </span>
        <div className="flex gap-6">
          <a
            href={siteInfo.githubRepo}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-ink"
          >
            GitHub
          </a>
          <a
            href={apiDocsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-ink"
          >
            API docs
          </a>
        </div>
      </div>
    </footer>
  )
}
