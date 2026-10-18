<script lang="ts">
	import type { PageContent } from '#lib/content/types.ts';
	import Downloads from './Downloads.svelte';
	import Gallery from './Gallery.svelte';
	import IconList from './IconList.svelte';
	import RichText from './RichText.svelte';
	import Video from './Video.svelte';

	let { page }: { page: PageContent } = $props();
</script>

<svelte:head>
	<title>{page.title}</title>
</svelte:head>

<main>
	{#each page.blocks as block (block.id)}
		{#if block.type === 'richtext'}
			<RichText title={block.title} content={block.content} />
		{:else if block.type === 'gallery'}
			<Gallery title={block.title} content={block.content} layout={block.layout} images={block.images} />
		{:else if block.type === 'video'}
			<Video title={block.title} content={block.content} videoSrc={block.videoSrc} embedSrc={block.embedSrc} />
		{:else if block.type === 'icons'}
			<IconList title={block.title} content={block.content} icons={block.icons} />
		{:else if block.type === 'downloads'}
			<Downloads title={block.title} content={block.content} files={block.files} />
		{/if}
	{/each}
</main>
