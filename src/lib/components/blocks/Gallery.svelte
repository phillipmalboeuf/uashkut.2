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
	let dialog: HTMLDialogElement | undefined;
	let selected = $state<number | null>(null);
	let current = $derived(selected === null ? null : images[selected]);

	function carousel(node: HTMLDivElement) {
		scroller = node;
		return () => {
			scroller = undefined;
		};
	}

	function modal(node: HTMLDialogElement) {
		dialog = node;
		return () => {
			dialog = undefined;
		};
	}

	function scrollByDirection(direction: number) {
		if (!scroller) return;
		scroller.scrollBy({ left: direction * scroller.clientWidth * 0.8, behavior: 'smooth' });
	}

	function open(index: number) {
		selected = index;
		dialog?.showModal();
	}

	function step(direction: number) {
		if (selected === null) return;
		selected = (selected + direction + images.length) % images.length;
	}

	function onkeydown(event: KeyboardEvent) {
		if (event.key === 'ArrowLeft') step(-1);
		else if (event.key === 'ArrowRight') step(1);
	}
</script>

<BlockSection {title} {content}>
	{#if layout === 'grid'}
		<div class="grid gap-4 sm:grid-cols-2">
			{#each images as image, i (image.id)}
				<figure class="card overflow-hidden bg-base-200">
					<button
						type="button"
						class="block w-full cursor-zoom-in"
						aria-label={image.caption ?? image.image.alt}
						onclick={() => open(i)}
					>
						<Image
							class="h-72 w-full object-cover"
							image={image.image}
							sizes="(min-width: 1024px) 496px, (min-width: 640px) 50vw, 100vw"
						/>
					</button>
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
				{#each images as image, i (image.id)}
					<figure class="carousel-item flex w-80 flex-col gap-3 sm:w-[28rem]">
						<button
							type="button"
							class="block w-full cursor-zoom-in"
							aria-label={image.caption ?? image.image.alt}
							onclick={() => open(i)}
						>
							<Image
								class="h-80 w-full rounded-box bg-base-300 object-contain"
								image={image.image}
								sizes="(min-width: 640px) 448px, 320px"
							/>
						</button>
						{#if image.caption}
							<figcaption class="text-sm opacity-80">{image.caption}</figcaption>
						{/if}
					</figure>
				{/each}
			</div>
		</div>
	{/if}
</BlockSection>

<dialog {@attach modal} class="modal" onclose={() => (selected = null)} {onkeydown}>
	<div
		class="modal-box flex h-full max-h-none w-full max-w-none flex-col items-center justify-center gap-3 rounded-none bg-base-300/95 p-4"
	>
		<form method="dialog" class="absolute top-4 right-4">
			<button class="btn btn-circle btn-ghost" aria-label={m.close()}>✕</button>
		</form>
		{#if current}
			<Image
				class="max-h-[85vh] w-auto max-w-full object-contain"
				image={current.image}
				sizes="100vw"
				loading="eager"
			/>
			{#if current.caption}
				<p class="text-sm opacity-80">{current.caption}</p>
			{/if}
		{/if}
		{#if images.length > 1}
			<button
				type="button"
				class="btn absolute top-1/2 left-4 btn-circle -translate-y-1/2"
				aria-label={m.previous()}
				onclick={() => step(-1)}>❮</button
			>
			<button
				type="button"
				class="btn absolute top-1/2 right-4 btn-circle -translate-y-1/2"
				aria-label={m.next()}
				onclick={() => step(1)}>❯</button
			>
		{/if}
	</div>
	<form method="dialog" class="modal-backdrop"><button>{m.close()}</button></form>
</dialog>
