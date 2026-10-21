import { createDirectus, readItems, readSingleton, rest, staticToken } from '@directus/sdk';
import { DIRECTUS_TOKEN, DIRECTUS_URL } from '$app/env/private';

export const directusUrl = DIRECTUS_URL;

const directus = DIRECTUS_TOKEN
	? createDirectus(directusUrl).with(staticToken(DIRECTUS_TOKEN)).with(rest())
	: createDirectus(directusUrl).with(rest());

export function assetUrl(id: string, search: Record<string, string> = {}): string {
	const url = new URL(`/assets/${id}`, directusUrl);
	for (const [key, value] of Object.entries(search)) url.searchParams.set(key, value);
	return url.href;
}

const pageFields = [
	'id',
	'slug',
	'is_index',
	'translations.languages_code',
	'translations.title',
	'blocks.id',
	'blocks.collection',
	'blocks.sort',
	'blocks.item:block_hero.status',
	'blocks.item:block_hero.image_constraint',
	'blocks.item:block_hero.image_max',
	'blocks.item:block_hero.image.id',
	'blocks.item:block_hero.image.title',
	'blocks.item:block_hero.image.translations.languages_code',
	'blocks.item:block_hero.image.translations.title',
	'blocks.item:block_hero.translations.languages_code',
	'blocks.item:block_hero.translations.content',
	'blocks.item:block_hero.links.id',
	'blocks.item:block_hero.links.sort',
	'blocks.item:block_hero.links.type',
	'blocks.item:block_hero.links.style',
	'blocks.item:block_hero.links.url',
	'blocks.item:block_hero.links.translations.languages_code',
	'blocks.item:block_hero.links.translations.title',
	'blocks.item:block_hero.links.page.slug',
	'blocks.item:block_hero.links.page.is_index',
	'blocks.item:block_hero.links.page.status',
	'blocks.item:block_hero.links.page.translations.languages_code',
	'blocks.item:block_hero.links.page.translations.title',
	'blocks.item:block_richtext.status',
	'blocks.item:block_richtext.centered',
	'blocks.item:block_richtext.translations.languages_code',
	'blocks.item:block_richtext.translations.title',
	'blocks.item:block_richtext.translations.content',
	'blocks.item:block_gallery.status',
	'blocks.item:block_gallery.layout',
	'blocks.item:block_gallery.translations.languages_code',
	'blocks.item:block_gallery.translations.title',
	'blocks.item:block_gallery.translations.content',
	'blocks.item:block_gallery.images.id',
	'blocks.item:block_gallery.images.sort',
	'blocks.item:block_gallery.images.directus_files_id.id',
	'blocks.item:block_gallery.images.directus_files_id.title',
	'blocks.item:block_gallery.images.directus_files_id.description',
	'blocks.item:block_gallery.images.directus_files_id.translations.languages_code',
	'blocks.item:block_gallery.images.directus_files_id.translations.title',
	'blocks.item:block_gallery.images.directus_files_id.translations.description',
	'blocks.item:block_video.status',
	'blocks.item:block_video.source',
	'blocks.item:block_video.embed_url',
	'blocks.item:block_video.video.id',
	'blocks.item:block_video.translations.languages_code',
	'blocks.item:block_video.translations.title',
	'blocks.item:block_video.translations.content',
	'blocks.item:block_icons.status',
	'blocks.item:block_icons.translations.languages_code',
	'blocks.item:block_icons.translations.title',
	'blocks.item:block_icons.translations.content',
	'blocks.item:block_icons.icons.id',
	'blocks.item:block_icons.icons.sort',
	'blocks.item:block_icons.icons.status',
	'blocks.item:block_icons.icons.icon.id',
	'blocks.item:block_icons.icons.icon.title',
	'blocks.item:block_icons.icons.icon.translations.languages_code',
	'blocks.item:block_icons.icons.icon.translations.title',
	'blocks.item:block_icons.icons.translations.languages_code',
	'blocks.item:block_icons.icons.translations.title',
	'blocks.item:block_icons.icons.translations.content',
	'blocks.item:block_downloads.status',
	'blocks.item:block_downloads.translations.languages_code',
	'blocks.item:block_downloads.translations.title',
	'blocks.item:block_downloads.translations.content',
	'blocks.item:block_downloads.files.id',
	'blocks.item:block_downloads.files.sort',
	'blocks.item:block_downloads.files.directus_files_id.id',
	'blocks.item:block_downloads.files.directus_files_id.title',
	'blocks.item:block_downloads.files.directus_files_id.description',
	'blocks.item:block_downloads.files.directus_files_id.filename_download',
	'blocks.item:block_downloads.files.directus_files_id.translations.languages_code',
	'blocks.item:block_downloads.files.directus_files_id.translations.title',
	'blocks.item:block_downloads.files.directus_files_id.translations.description',
	'blocks.item:block_image_map.status',
	'blocks.item:block_image_map.image.id',
	'blocks.item:block_image_map.image.title',
	'blocks.item:block_image_map.image.width',
	'blocks.item:block_image_map.image.height',
	'blocks.item:block_image_map.image.translations.languages_code',
	'blocks.item:block_image_map.image.translations.title',
	'blocks.item:block_image_map.translations.languages_code',
	'blocks.item:block_image_map.translations.title',
	'blocks.item:block_image_map.translations.content',
	'blocks.item:block_image_map.areas.id',
	'blocks.item:block_image_map.areas.sort',
	'blocks.item:block_image_map.areas.coords',
	'blocks.item:block_image_map.areas.type',
	'blocks.item:block_image_map.areas.url',
	'blocks.item:block_image_map.areas.translations.languages_code',
	'blocks.item:block_image_map.areas.translations.title',
	'blocks.item:block_image_map.areas.page.slug',
	'blocks.item:block_image_map.areas.page.is_index',
	'blocks.item:block_image_map.areas.page.status',
	'blocks.item:block_image_map.areas.page.translations.languages_code',
	'blocks.item:block_image_map.areas.page.translations.title'
] as const;

export type PageRecord = {
	id: string;
	slug: string | null;
	is_index: boolean;
	translations: { languages_code: string | { code: string } | null; title: string | null }[] | null;
	blocks: RawBlock[] | null;
};

export type RawBlock = {
	id: string;
	collection: string | null;
	sort: number | null;
	item: Record<string, unknown> | null;
};

export async function readPages(filter: Record<string, unknown>): Promise<PageRecord[]> {
	return directus.request(
		readItems('pages', {
			fields: [...pageFields],
			filter,
			limit: 1
		})
	) as Promise<PageRecord[]>;
}

const navigationFields = [
	'links.id',
	'links.sort',
	'links.type',
	'links.url',
	'links.translations.languages_code',
	'links.translations.title',
	'links.page.slug',
	'links.page.is_index',
	'links.page.status',
	'links.page.translations.languages_code',
	'links.page.translations.title'
] as const;

type TitleTranslation = { languages_code: string | { code: string } | null; title: string | null };

export type LinkRecord = {
	id: string;
	type: 'page' | 'external' | null;
	url: string | null;
	translations: TitleTranslation[] | null;
	page: {
		slug: string | null;
		is_index: boolean;
		status: string | null;
		translations: TitleTranslation[] | null;
	} | null;
};

export type NavigationLinkRecord = LinkRecord & { sort: number | null };

export type NavigationRecord = {
	links: NavigationLinkRecord[] | null;
};

export async function readNavigation(): Promise<NavigationRecord | null> {
	return directus.request(
		readSingleton('navigation', { fields: [...navigationFields] })
	) as Promise<NavigationRecord | null>;
}
