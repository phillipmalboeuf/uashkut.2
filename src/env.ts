import { defineEnvVars } from '@sveltejs/kit/env';

const directusOrigin = 'https://uashkut.up.railway.app';

export const variables = defineEnvVars({
	DIRECTUS_URL: {
		description: 'Directus API origin',
		schema: (value: string | undefined) => value || directusOrigin
	},
	DIRECTUS_TOKEN: {
		description: 'Optional static token used when the Public policy cannot read content',
		schema: (value: string | undefined) => value || undefined
	}
});
