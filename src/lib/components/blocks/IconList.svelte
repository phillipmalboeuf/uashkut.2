<script lang="ts">
	import type { IconItem } from '#lib/content/types.ts';
	import BlockSection from './BlockSection.svelte';
	import Prose from './Prose.svelte';

	let {
		title,
		content,
		icons
	}: {
		title: string | null;
		content: string | null;
		icons: IconItem[];
	} = $props();
</script>

<BlockSection {title} {content}>
	<ul class="list rounded-box bg-base-200 shadow-md">
		{#each icons as icon (icon.id)}
			<li class="list-row">
				{#if icon.src}
					<img class="size-12 rounded-box bg-base-100 object-cover" src={icon.src} alt={icon.title ? '' : icon.alt} />
				{/if}
				<div>
					{#if icon.title}
						<div class="font-semibold">{icon.title}</div>
					{/if}
					<Prose html={icon.content} />
				</div>
			</li>
		{/each}
	</ul>
</BlockSection>
