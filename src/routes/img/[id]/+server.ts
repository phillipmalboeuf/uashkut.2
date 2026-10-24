import { error } from '@sveltejs/kit';
import { DIRECTUS_TOKEN, DIRECTUS_URL } from '$app/env/private';
import { imageFits, imageWidths } from '#lib/content/images.ts';
import type { RequestHandler } from './$types';

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function allowedSize(value: string | null): number | null | undefined {
	if (value === null) return null;
	const size = Number(value);
	return imageWidths.includes(size) ? size : undefined;
}

export const GET: RequestHandler = async ({ params, url, fetch }) => {
	const width = allowedSize(url.searchParams.get('w'));
	const height = allowedSize(url.searchParams.get('h'));
	const fit = url.searchParams.get('fit');
	if (!uuidPattern.test(params.id) || !width || height === undefined || (fit !== null && !imageFits.includes(fit))) {
		error(400, 'Invalid image request');
	}

	const upstream = new URL(`/assets/${params.id}`, DIRECTUS_URL);
	upstream.searchParams.set('width', String(width));
	if (height) upstream.searchParams.set('height', String(height));
	if (fit) upstream.searchParams.set('fit', fit);
	upstream.searchParams.set('format', 'webp');
	upstream.searchParams.set('quality', '80');
	upstream.searchParams.set('withoutEnlargement', 'true');

	const response = await fetch(upstream, {
		headers: DIRECTUS_TOKEN ? { Authorization: `Bearer ${DIRECTUS_TOKEN}` } : {}
	});
	if (!response.ok || !response.body) {
		return new Response(null, { status: response.ok ? 502 : response.status, headers: { 'Cache-Control': 'no-store' } });
	}

	return new Response(response.body, {
		headers: {
			'Content-Type': response.headers.get('Content-Type') ?? 'image/webp',
			'Cache-Control': 'public, max-age=31536000, immutable',
			'CDN-Cache-Control': 'public, s-maxage=31536000'
		}
	});
};
