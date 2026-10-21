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
		<div class="map mx-auto w-full">
			<div class="map-scale relative">
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
		</div>
	{/if}
</BlockSection>

<style>
	.map {
		view-timeline: --map block;
		z-index: 0;
	}

	img {
		box-shadow: 20px 0 20px 0 rgba(255, 255, 255, 0.30) inset, 0 -975px 250px 0 rgba(255, 255, 255, 0.00), 0 -624px 250px 0 rgba(255, 255, 255, 0.01), 0 -351px 211px 0 rgba(255, 255, 255, 0.05), 0 -156px 156px 0 rgba(255, 255, 255, 0.09), 0 -39px 86px 0 rgba(255, 255, 255, 0.10);
		border-radius: 50%;
	}

	@media (prefers-reduced-motion: no-preference) {
		@supports (animation-timeline: view()) {
			.map-scale {
				/* scale-out only fills forwards so scale-in still applies before the exit range */
				animation:
					scale-in linear both,
					scale-out linear forwards;
				animation-timeline: --map, --map;
				animation-range: entry, exit;
			}
		}
	}

	@keyframes scale-in {
		from {
			scale: 3;
			transform-origin: top center;
		}
		to {
			scale: 1;
			transform-origin: top center;
		}
	}

	/* @keyframes scale-out {
		from {
			scale: 1;
			transform-origin: bottom center;
		}
		to {
			scale: 3;
			transform-origin: bottom center;
		}
	} */
</style>
