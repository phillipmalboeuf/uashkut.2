<script lang="ts">
	import { m } from '#lib/paraglide/messages.js';
	import type { GalleryImage } from '#lib/content/types.ts';
	import Image from '../Image.svelte';
	import BlockSection from './BlockSection.svelte';

	let {
		title,
		content,
		layout,
		images
	}: {
		title: string | null;
		content: string | null;
		layout: 'carousel' | 'grid';
		images: GalleryImage[];
	} = $props();

	let scroller: HTMLDivElement | undefined;

	function carousel(node: HTMLDivElement) {
		scroller = node;
		return () => {
			scroller = undefined;
		};
	}

	function scrollByDirection(direction: number) {
		if (!scroller) return;
		scroller.scrollBy({ left: direction * scroller.clientWidth * 0.8, behavior: 'smooth' });
	}
</script>

<BlockSection {title} {content}>
	{#if layout === 'grid'}
		<div class="grid gap-4 sm:grid-cols-2">
			{#each images as image (image.id)}
				<figure class="card overflow-hidden bg-base-200">
					<Image
						class="h-72 w-full object-cover"
						image={image.image}
						sizes="(min-width: 1024px) 496px, (min-width: 640px) 50vw, 100vw"
					/>
					{#if image.caption}
						<figcaption class="p-4 text-sm opacity-80">{image.caption}</figcaption>
					{/if}
				</figure>
			{/each}
		</div>
	{:else}
		<div class="flex flex-col gap-3">
			{#if images.length > 1}
				<div class="flex justify-end gap-2">
					<button
						type="button"
						class="btn btn-circle"
						aria-label={m.previous()}
						onclick={() => scrollByDirection(-1)}>❮</button
					>
					<button
						type="button"
						class="btn btn-circle"
						aria-label={m.next()}
						onclick={() => scrollByDirection(1)}>❯</button
					>
				</div>
			{/if}
			<div {@attach carousel} class="carousel carousel-center w-full gap-4 rounded-box bg-base-200 p-4">
				{#each images as image (image.id)}
					<figure class="carousel-item flex w-80 flex-col gap-3 sm:w-[28rem]">
						<Image
							class="h-80 w-full rounded-box bg-base-300 object-contain"
							image={image.image}
							sizes="(min-width: 640px) 448px, 320px"
						/>
						{#if image.caption}
							<figcaption class="text-sm opacity-80">{image.caption}</figcaption>
						{/if}
					</figure>
				{/each}
			</div>
		</div>
	{/if}
</BlockSection>
