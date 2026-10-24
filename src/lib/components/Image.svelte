<script lang="ts">
	import type { HTMLImgAttributes } from 'svelte/elements';
	import { assetPath, imageWidths } from '#lib/content/images.ts';
	import type { ImageAsset } from '#lib/content/types.ts';

	let {
		image,
		sizes,
		alt,
		widths = imageWidths,
		square = false,
		loading = 'lazy',
		decoding = 'async',
		...rest
	}: Omit<HTMLImgAttributes, 'src' | 'srcset' | 'width' | 'height'> & {
		image: ImageAsset;
		sizes: string;
		widths?: readonly number[];
		square?: boolean;
	} = $props();

	let candidates = $derived.by(() => {
		if (image.vector) return [{ width: widths[widths.length - 1], actual: null }];
		const intrinsic = image.width;
		if (!intrinsic) return widths.map((width) => ({ width, actual: width }));
		const smaller = widths.filter((width) => width < intrinsic).map((width) => ({ width, actual: width }));
		const cap = widths.find((width) => width >= intrinsic);
		return cap ? [...smaller, { width: cap, actual: intrinsic }] : smaller;
	});

	let urls = $derived(
		candidates.map(({ width, actual }) => ({
			url: assetPath(image.id, {
				w: width,
				h: square ? width : undefined,
				fit: square ? 'cover' : undefined,
				v: image.version
			}),
			actual
		}))
	);

	let largest = $derived(candidates.at(-1)?.actual);
</script>

<img
	{...rest}
	src={urls[Math.floor((urls.length - 1) / 2)]?.url}
	srcset={image.vector ? undefined : urls.map(({ url, actual }) => `${url} ${actual}w`).join(', ')}
	sizes={image.vector ? undefined : sizes}
	alt={alt ?? image.alt}
	width={square ? largest : image.width}
	height={square ? largest : image.height}
	{loading}
	{decoding}
/>
