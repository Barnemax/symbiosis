import { routing } from '@/i18n/routing'

type LocalePath = string | Record<string, string>

function resolveLocalePath(pathConfig: LocalePath, locale: string): string {
  if (typeof pathConfig === 'string') {
return pathConfig
}
  return pathConfig[locale] ?? pathConfig[routing.defaultLocale] ?? Object.values(pathConfig)[0]
}

/**
 * Builds an absolute URL for any locale, driven entirely by routing.pathnames.
 * Respects localePrefix: 'as-needed' — default locale gets no prefix.
 *
 * buildLocalizedUrl(siteUrl, '/birds', 'fr') → 'https://…/fr/oiseaux'
 * buildLocalizedUrl(siteUrl, '/birds/[slug]', 'en', { slug: 'alcedo-atthis' }) → 'https://…/birds/alcedo-atthis'
 */
export function buildLocalizedUrl(
  siteUrl: string,
  internalPath: string,
  locale: string,
  params?: Record<string, string>,
): string {
  const pathConfig = routing.pathnames[internalPath as keyof typeof routing.pathnames] as LocalePath | undefined
  let localePath = pathConfig ? resolveLocalePath(pathConfig, locale) : internalPath

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      localePath = localePath.replace(`[${key}]`, value)
    }
  }

  const prefix = locale === routing.defaultLocale ? '' : `/${locale}`
  return `${siteUrl}${prefix}${localePath}`
}

/**
 * Builds the alternates object for generateMetadata and sitemap entries.
 * Iterates over all locales in routing.locales — adding a locale to routing.ts is enough.
 */
export function buildAlternates(
  siteUrl: string,
  internalPath: string,
  params?: Record<string, string>,
): { languages: Record<string, string> } {
  const languages: Record<string, string> = {}
  for (const locale of routing.locales) {
    languages[locale] = buildLocalizedUrl(siteUrl, internalPath, locale, params)
  }
  languages['x-default'] = buildLocalizedUrl(siteUrl, internalPath, routing.defaultLocale, params)
  return { languages }
}
