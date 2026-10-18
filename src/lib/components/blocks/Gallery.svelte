<script lang="ts">
	import { m } from '#lib/paraglide/messages.js';
	import type { GalleryImage } from '#lib/content/types.ts';
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
					<img class="h-72 w-full object-cover" src={image.src} alt={image.alt} />
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
					<div class="carousel-item">
						<img class="h-80 rounded-box object-cover" src={image.src} alt={image.alt} />
					</div>
				{/each}
			</div>
		</div>
	{/if}
</BlockSection>
