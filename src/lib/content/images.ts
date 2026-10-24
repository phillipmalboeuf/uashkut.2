export const imageWidths: readonly number[] = [160, 320, 640, 960, 1280, 1920, 2560];

export const imageFits: readonly string[] = ['cover', 'contain'];

export type AssetParams = {
	w: number;
	h?: number;
	fit?: 'cover' | 'contain';
	v?: string | null;
};

export function assetPath(id: string, { w, h, fit, v }: AssetParams): string {
	const search = new URLSearchParams({ w: String(w) });
	if (h) search.set('h', String(h));
	if (fit) search.set('fit', fit);
	if (v) search.set('v', v);
	return `/img/${id}?${search}`;
}
