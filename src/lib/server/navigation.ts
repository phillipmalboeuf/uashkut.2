import { error } from '@sveltejs/kit';
import { isDirectusError } from '@directus/sdk';
import type { NavLink } from '#lib/content/types.ts';
import { readNavigation } from '#lib/server/directus.ts';
import { toNavLink } from '#lib/server/links.ts';

export async function getNavigation(locale: string): Promise<NavLink[]> {
	try {
		const navigation = await readNavigation();
		const links = [...(navigation?.links ?? [])].sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0));
		return links.flatMap((link) => {
			const mapped = toNavLink(link, locale);
			return mapped ? [mapped] : [];
		});
	} catch (cause) {
		if (isDirectusError(cause) && cause.response.status === 403) {
			error(503, 'Directus refused the navigation request. Add DIRECTUS_TOKEN or grant the Public policy read access.');
		}
		throw cause;
	}
}
