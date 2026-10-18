<script lang="ts">
	import type { Path } from '$app/types';
	import { resolve } from '$app/paths';
	import { localizeHref } from '#lib/paraglide/runtime.js';
	import type { HeroBlock } from '#lib/content/types.ts';
	import ExternalIcon from '../ExternalIcon.svelte';
	import Prose from './Prose.svelte';

	let {
		content,
		image,
		imageConstraint,
		imageMax,
		links
	}: Pick<HeroBlock, 'content' | 'image' | 'imageConstraint' | 'imageMax' | 'links'> = $props();

	let maxHeight = $derived(imageConstraint === 'height' && imageMax ? `${imageMax}px` : undefined);
	let maxWidth = $derived(imageConstraint === 'width' && imageMax ? `min(${imageMax}px, 100%)` : undefined);
</script>

<section class="hero py-12">
	<div class="hero-content w-full flex-col text-center">
		{#if image}
			<img
				class="h-auto w-auto max-w-full rounded-box"
				src={image.src}
				alt={image.alt}
				style:max-height={maxHeight}
				style:max-width={maxWidth}
			/>
		{/if}
		{#if content}
			<div class="w-full max-w-3xl">
				<Prose html={content} />
			</div>
		{/if}
		{#if links.length}
			<div class="flex flex-wrap justify-center gap-2">
				{#each links as link (link.id)}
					{@const style = link.style === 'outline' ? 'btn-outline' : 'btn-primary'}
					{#if link.external}
						<a class={['btn', style]} href={link.href} target="_blank" rel="noopener noreferrer">
							{link.label}
							<ExternalIcon />
						</a>
					{:else}
						<a class={['btn', style]} href={resolve(localizeHref(link.href) as Path)}>{link.label}</a>
					{/if}
				{/each}
			</div>
		{/if}
	</div>
</section>
