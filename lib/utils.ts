import countries from '@/lib/countries.json' with { type: 'json' }

export const raise = (err: unknown) => {
  throw new Error(String(err))
}

export const flag = Object.fromEntries(
  countries.map((country) => [
    country.code,
    country.code
      .toUpperCase()
      .replace(/./g, (sub) => String.fromCodePoint(127397 + sub.charCodeAt(0))),
  ]),
)
