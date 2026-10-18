export type GalleryImage = {
	id: string;
	src: string;
	alt: string;
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

export type PageBlock = RichTextBlock | GalleryBlock | VideoBlock | IconListBlock | DownloadsBlock;

export type PageContent = {
	id: string;
	title: string;
	blocks: PageBlock[];
};
