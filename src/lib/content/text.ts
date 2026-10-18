export const fallbackLocale = 'fr';

export type Translation = {
	languages_code: string | { code: string } | null;
	title?: string | null;
	content?: string | null;
	description?: string | null;
};

export function languageCode(translation: Translation): string | null {
	const code = translation.languages_code;
	if (typeof code === 'string') return code;
	return code?.code ?? null;
}

export function translationFor<T extends Translation>(
	translations: T[] | null | undefined,
	locale: string
): T | undefined {
	if (!translations?.length) return undefined;
	return (
		translations.find((item) => languageCode(item) === locale) ??
		translations.find((item) => languageCode(item) === fallbackLocale) ??
		translations[0]
	);
}

export function translatedField(
	translations: Translation[] | null | undefined,
	locale: string,
	field: 'title' | 'content' | 'description',
	fallback: string | null | undefined
): string | null {
	const value = translationFor(translations, locale)?.[field];
	if (typeof value === 'string' && value.length > 0) return value;
	if (typeof fallback === 'string' && fallback.length > 0) return fallback;
	return null;
}
