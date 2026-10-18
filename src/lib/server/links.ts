import { translatedField } from '#lib/content/text.ts';
import type { NavLink } from '#lib/content/types.ts';
import type { LinkRecord } from '#lib/server/directus.ts';

export function toNavLink(link: LinkRecord, locale: string): NavLink | null {
	const label = translatedField(link.translations, locale, 'title', null);

	if (link.type === 'external') {
		if (!link.url || !label) return null;
		return { id: link.id, href: link.url, label, external: true };
	}

	const page = link.page;
	if (!page || page.status !== 'published') return null;
	if (!page.is_index && !page.slug) return null;
	return {
		id: link.id,
		href: page.is_index ? '/' : `/${page.slug}`,
		label: label ?? translatedField(page.translations, locale, 'title', null) ?? page.slug ?? '',
		external: false
	};
}
