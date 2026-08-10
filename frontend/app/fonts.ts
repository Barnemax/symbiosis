import { Fraunces, Instrument_Sans } from 'next/font/google'

/*
 * Shared by both root layouts (public `[locale]` and `admin`). next/font hashes
 * per call site, so defining these once keeps a single set of preloaded files.
 */
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

export const fontVariables = `${fraunces.variable} ${instrumentSans.variable}`
