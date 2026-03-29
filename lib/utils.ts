import countries from '@/lib/countries.json' with { type: "json" }

export const raise = (err: unknown) => { throw new Error(String(err)) }

export const flag = countries.map(country => (
  country.code.toUpperCase().replace(/./g, c =>
    String.fromCodePoint(127397 + c.charCodeAt(0))
  )
))