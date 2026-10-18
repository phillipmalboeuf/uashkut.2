import { error } from '@sveltejs/kit';
import { getLocale } from '#lib/paraglide/runtime.js';
import { getPageBySlug } from '#lib/server/pages.ts';

export const load = async ({ params }) => {
	const page = await getPageBySlug(params.slug, getLocale());
	if (!page) error(404, 'Page not found');
	return { page };
};
