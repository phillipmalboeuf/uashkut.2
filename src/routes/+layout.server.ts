import { getLocale } from '#lib/paraglide/runtime.js';
import { getNavigation } from '#lib/server/navigation.ts';

export const load = async () => {
	return { navigation: await getNavigation(getLocale()) };
};
