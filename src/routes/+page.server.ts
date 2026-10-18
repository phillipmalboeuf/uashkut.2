import { error } from '@sveltejs/kit';
import { getLocale } from '#lib/paraglide/runtime.js';
import { getIndexPage } from '#lib/server/pages.ts';

export const load = async () => {
	const page = await getIndexPage(getLocale());
	if (!page) error(404, 'Page not found');
	return { page };
};
