import { nameMinChars } from '@/constants'
import countries from '@/lib/countries.json' with { type: 'json' }

export const raise = (err: unknown) => {
	throw new Error(String(err))
}

export const flag = Object.fromEntries(
	countries.map(country => [
		country.code,
		country.code
			.toUpperCase()
			.replace(/./g, sub => String.fromCodePoint(127397 + sub.charCodeAt(0))),
	]),
)

export const guard = <T>(value: unknown, from: readonly T[]): value is T =>
	(from as readonly unknown[]).includes(value)

export const isValidName = (name: string) => /^[\p{L}\s]+$/u.test(name) && name.length >= nameMinChars