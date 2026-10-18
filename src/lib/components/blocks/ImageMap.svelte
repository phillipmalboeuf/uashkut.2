<script lang="ts">
	import type { Path } from '$app/types';
	import { resolve } from '$app/paths';
	import { localizeHref } from '#lib/paraglide/runtime.js';
	import type { ImageMapBlock } from '#lib/content/types.ts';
	import BlockSection from './BlockSection.svelte';

	let { title, content, image, areas }: Pick<ImageMapBlock, 'title' | 'content' | 'image' | 'areas'> = $props();
</script>

<BlockSection {title} {content}>
	{#if image}
		<div class="relative mx-auto w-full max-w-3xl">
			<img class="block h-auto w-full" src={image.src} alt={image.alt} width={image.width} height={image.height} />
			<svg class="absolute inset-0 size-full" viewBox="0 0 {image.width} {image.height}">
				{#each areas as area (area.id)}
					<a
						class="group outline-none"
						href={area.external ? area.href : resolve(localizeHref(area.href) as Path)}
						target={area.external ? '_blank' : undefined}
						rel={area.external ? 'noopener noreferrer' : undefined}
						aria-label={area.label}
					>
						<title>{area.label}</title>
						<polygon
							class="fill-white/0 stroke-white/0 transition-colors duration-300 group-hover:fill-white/10 group-hover:stroke-white/60 group-focus-visible:fill-white/10 group-focus-visible:stroke-white"
							points={area.points}
							stroke-width="2"
							stroke-linejoin="round"
							vector-effect="non-scaling-stroke"
						/>
					</a>
				{/each}
			</svg>
		</div>
	{/if}
</BlockSection>
