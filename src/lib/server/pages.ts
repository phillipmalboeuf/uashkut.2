import { error } from '@sveltejs/kit';
import { isDirectusError } from '@directus/sdk';
import { embedSrc } from '#lib/content/embed.ts';
import { translatedField } from '#lib/content/text.ts';
import type { ImageAsset, PageBlock, PageContent } from '#lib/content/types.ts';
import { assetUrl, readPages, type LinkRecord, type PageRecord, type RawBlock } from '#lib/server/directus.ts';
import { toNavLink } from '#lib/server/links.ts';

type TranslationRow = {
	languages_code: string | { code: string } | null;
	title?: string | null;
	content?: string | null;
	description?: string | null;
};

type FileRow = {
	id: string;
	title?: string | null;
	description?: string | null;
	filename_download?: string | null;
	width?: number | null;
	height?: number | null;
	modified_on?: string | null;
	type?: string | null;
	translations?: TranslationRow[] | null;
};

function published(item: Record<string, unknown> | null): item is Record<string, unknown> {
	return item?.status === 'published';
}

function translations(item: Record<string, unknown>): TranslationRow[] {
	return Array.isArray(item.translations) ? (item.translations as TranslationRow[]) : [];
}

function fileRow(value: unknown): FileRow | null {
	if (!value || typeof value !== 'object' || !('id' in value)) return null;
	const file = value as FileRow;
	return typeof file.id === 'string' ? file : null;
}

function imageAsset(file: FileRow, locale: string): ImageAsset {
	const modified = file.modified_on ? Date.parse(file.modified_on) : NaN;
	return {
		id: file.id,
		alt: translatedField(file.translations, locale, 'title', file.title) ?? '',
		width: file.width ?? null,
		height: file.height ?? null,
		version: Number.isFinite(modified) ? modified.toString(36) : null,
		vector: file.type === 'image/svg+xml'
	};
}

function sorted<T extends { sort?: number | null }>(items: T[]): T[] {
	return [...items].sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0));
}

function copy(item: Record<string, unknown>, locale: string) {
	const rows = translations(item);
	return {
		title: translatedField(rows, locale, 'title', null),
		content: translatedField(rows, locale, 'content', null)
	};
}

function polygonPoints(coords: unknown): string | null {
	if (typeof coords !== 'string') return null;
	const values = coords.split(/[\s,]+/).filter(Boolean).map(Number);
	if (values.length < 6 || values.length % 2 !== 0 || values.some((value) => !Number.isFinite(value))) return null;
	const points: string[] = [];
	for (let i = 0; i < values.length; i += 2) points.push(`${values[i]},${values[i + 1]}`);
	return points.join(' ');
}

function mapBlock(block: RawBlock, locale: string): PageBlock | null {
	if (!published(block.item) || !block.collection) return null;
	const item = block.item;
	const text = copy(item, locale);

	if (block.collection === 'block_hero') {
		const file = fileRow(item.image);
		const background = fileRow(item.background);
		const links = sorted(
			Array.isArray(item.links) ? (item.links as (LinkRecord & { sort?: number | null; style?: string })[]) : []
		).flatMap((link) => {
			const mapped = toNavLink(link, locale);
			if (!mapped) return [];
			return [{ ...mapped, style: link.style === 'outline' ? ('outline' as const) : ('primary' as const) }];
		});
		return {
			id: block.id,
			type: 'hero',
			content: text.content,
			image: file ? imageAsset(file, locale) : null,
			imageConstraint: item.image_constraint === 'width' ? 'width' : 'height',
			imageMax: typeof item.image_max === 'number' && item.image_max > 0 ? item.image_max : null,
			background: background ? imageAsset(background, locale) : null,
			backgroundFade: item.background_fade !== false,
			links
		};
	}

	if (block.collection === 'block_richtext') {
		return { id: block.id, type: 'richtext', ...text, centered: item.centered === true };
	}

	if (block.collection === 'block_gallery') {
		const images = sorted(
			Array.isArray(item.images) ? (item.images as { id?: string; sort?: number | null; directus_files_id?: unknown }[]) : []
		).flatMap((image) => {
			const file = fileRow(image.directus_files_id);
			if (!file || !image.id) return [];
			return [
				{
					id: image.id,
					image: imageAsset(file, locale),
					caption: translatedField(file.translations, locale, 'description', file.description)
				}
			];
		});
		return {
			id: block.id,
			type: 'gallery',
			...text,
			layout: item.layout === 'grid' ? 'grid' : 'carousel',
			images
		};
	}

	if (block.collection === 'block_video') {
		const video = fileRow(item.video);
		return {
			id: block.id,
			type: 'video',
			...text,
			videoSrc: item.source === 'file' && video ? assetUrl(video.id) : null,
			embedSrc: item.source === 'embed' ? embedSrc(typeof item.embed_url === 'string' ? item.embed_url : null) : null
		};
	}

	if (block.collection === 'block_icons') {
		const icons = sorted(
			Array.isArray(item.icons)
				? (item.icons as {
						id?: string;
						sort?: number | null;
						status?: string;
						icon?: unknown;
						translations?: TranslationRow[];
					}[])
				: []
		).flatMap((icon) => {
			if (icon.status !== 'published' || !icon.id) return [];
			const file = fileRow(icon.icon);
			const rows = icon.translations ?? [];
			return [
				{
					id: icon.id,
					image: file ? imageAsset(file, locale) : null,
					title: translatedField(rows, locale, 'title', null),
					content: translatedField(rows, locale, 'content', null)
				}
			];
		});
		return { id: block.id, type: 'icons', ...text, icons };
	}

	if (block.collection === 'block_downloads') {
		const files = sorted(
			Array.isArray(item.files)
				? (item.files as { id?: string; sort?: number | null; directus_files_id?: unknown }[])
				: []
		).flatMap((entry) => {
			const file = fileRow(entry.directus_files_id);
			if (!file || !entry.id) return [];
			const filename = file.filename_download || file.title || file.id;
			return [
				{
					id: entry.id,
					href: assetUrl(file.id, { download: filename }),
					title: translatedField(file.translations, locale, 'title', file.title) ?? filename,
					description: translatedField(file.translations, locale, 'description', file.description)
				}
			];
		});
		return { id: block.id, type: 'downloads', ...text, files };
	}

	if (block.collection === 'block_image_map') {
		const file = fileRow(item.image);
		const areas = sorted(
			Array.isArray(item.areas) ? (item.areas as (LinkRecord & { sort?: number | null; coords?: unknown })[]) : []
		).flatMap((area) => {
			const points = polygonPoints(area.coords);
			const mapped = points ? toNavLink(area, locale) : null;
			return mapped && points ? [{ ...mapped, points }] : [];
		});
		return {
			id: block.id,
			type: 'imagemap',
			...text,
			image:
				file && file.width && file.height
					? { ...imageAsset(file, locale), width: file.width, height: file.height }
					: null,
			areas
		};
	}

	return null;
}

function toPage(record: PageRecord, locale: string): PageContent {
	const blocks = sorted(record.blocks ?? []).flatMap((block) => {
		const mapped = mapBlock(block, locale);
		return mapped ? [mapped] : [];
	});
	return {
		id: record.id,
		title: translatedField(record.translations, locale, 'title', null) ?? 'Uashkut',
		blocks
	};
}

async function loadPage(filter: Record<string, unknown>, locale: string): Promise<PageContent | null> {
	try {
		const [record] = await readPages(filter);
		return record ? toPage(record, locale) : null;
	} catch (cause) {
		if (isDirectusError(cause) && cause.response.status === 403) {
			error(503, 'Directus refused the content request. Add DIRECTUS_TOKEN or grant the Public policy read access.');
		}
		throw cause;
	}
}

export function getIndexPage(locale: string): Promise<PageContent | null> {
	return loadPage({ status: { _eq: 'published' }, is_index: { _eq: true } }, locale);
}

export function getPageBySlug(slug: string, locale: string): Promise<PageContent | null> {
	return loadPage(
		{ status: { _eq: 'published' }, is_index: { _eq: false }, slug: { _eq: slug } },
		locale
	);
}
