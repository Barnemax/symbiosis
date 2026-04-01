import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  defaultLocale: 'en',
  localePrefix: 'as-needed',
  locales: ['en', 'fr'],
  pathnames: {
    '/': '/',
    '/birds': { en: '/birds', fr: '/oiseaux' },
    '/birds/[slug]': { en: '/birds/[slug]', fr: '/oiseaux/[slug]' },
    '/contact': '/contact',
    '/explore': { en: '/explore', fr: '/explorer' },
    '/fungi': { en: '/fungi', fr: '/champignons' },
    '/fungi/[slug]': { en: '/fungi/[slug]', fr: '/champignons/[slug]' },
    '/trees': { en: '/trees', fr: '/arbres' },
    '/trees/[slug]': { en: '/trees/[slug]', fr: '/arbres/[slug]' },
  },
})

export type AppLocale = (typeof routing)['locales'][number]
