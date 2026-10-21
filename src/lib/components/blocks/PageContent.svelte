<script lang="ts">
	import type { PageContent } from '#lib/content/types.ts';
	import Downloads from './Downloads.svelte';
	import Gallery from './Gallery.svelte';
	import Hero from './Hero.svelte';
	import IconList from './IconList.svelte';
	import ImageMap from './ImageMap.svelte';
	import RichText from './RichText.svelte';
	import Video from './Video.svelte';

	let { page }: { page: PageContent } = $props();
</script>

<svelte:head>
	<title>{page.title}</title>
</svelte:head>

<main class="overflow-clip">
	{#each page.blocks as block (block.id)}
		{#if block.type === 'hero'}
			<Hero
				content={block.content}
				image={block.image}
				imageConstraint={block.imageConstraint}
				imageMax={block.imageMax}
				links={block.links}
			/>
		{:else if block.type === 'richtext'}
			<RichText title={block.title} content={block.content} centered={block.centered} />
		{:else if block.type === 'gallery'}
			<Gallery title={block.title} content={block.content} layout={block.layout} images={block.images} />
		{:else if block.type === 'video'}
			<Video title={block.title} content={block.content} videoSrc={block.videoSrc} embedSrc={block.embedSrc} />
		{:else if block.type === 'icons'}
			<IconList title={block.title} content={block.content} icons={block.icons} />
		{:else if block.type === 'downloads'}
			<Downloads title={block.title} content={block.content} files={block.files} />
		{:else if block.type === 'imagemap'}
			<ImageMap title={block.title} content={block.content} image={block.image} areas={block.areas} />
		{/if}
	{/each}
</main>
