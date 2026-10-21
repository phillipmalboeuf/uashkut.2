export type GalleryImage = {
	id: string;
	src: string;
	alt: string;
	caption: string | null;
};

export type IconItem = {
	id: string;
	src: string | null;
	alt: string;
	title: string | null;
	content: string | null;
};

export type DownloadFile = {
	id: string;
	href: string;
	title: string;
	description: string | null;
};

export type RichTextBlock = {
	id: string;
	type: 'richtext';
	title: string | null;
	content: string | null;
	centered: boolean;
};

export type GalleryBlock = {
	id: string;
	type: 'gallery';
	title: string | null;
	content: string | null;
	layout: 'carousel' | 'grid';
	images: GalleryImage[];
};

export type VideoBlock = {
	id: string;
	type: 'video';
	title: string | null;
	content: string | null;
	videoSrc: string | null;
	embedSrc: string | null;
};

export type IconListBlock = {
	id: string;
	type: 'icons';
	title: string | null;
	content: string | null;
	icons: IconItem[];
};

export type DownloadsBlock = {
	id: string;
	type: 'downloads';
	title: string | null;
	content: string | null;
	files: DownloadFile[];
};

export type NavLink = {
	id: string;
	href: string;
	label: string;
	external: boolean;
};

export type HeroLink = NavLink & { style: 'primary' | 'outline' };

export type HeroBlock = {
	id: string;
	type: 'hero';
	content: string | null;
	image: { src: string; alt: string } | null;
	imageConstraint: 'height' | 'width';
	imageMax: number | null;
	links: HeroLink[];
};

export type ImageMapArea = NavLink & { points: string };

export type ImageMapBlock = {
	id: string;
	type: 'imagemap';
	title: string | null;
	content: string | null;
	image: { src: string; alt: string; width: number; height: number } | null;
	areas: ImageMapArea[];
};

export type PageBlock =
	| HeroBlock
	| RichTextBlock
	| GalleryBlock
	| VideoBlock
	| IconListBlock
	| DownloadsBlock
	| ImageMapBlock;

export type PageContent = {
	id: string;
	title: string;
	blocks: PageBlock[];
};
