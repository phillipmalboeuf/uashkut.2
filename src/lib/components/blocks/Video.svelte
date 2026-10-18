<script lang="ts">
	import BlockSection from './BlockSection.svelte';

	let {
		title,
		content,
		videoSrc,
		embedSrc
	}: {
		title: string | null;
		content: string | null;
		videoSrc: string | null;
		embedSrc: string | null;
	} = $props();
</script>

<BlockSection {title} {content}>
	{#if videoSrc}
		<video class="w-full rounded-box bg-base-200" controls src={videoSrc}>
			<track kind="captions" />
		</video>
	{:else if embedSrc}
		<div class="aspect-video overflow-hidden rounded-box bg-base-200">
			<iframe
				class="h-full w-full"
				src={embedSrc}
				title={title ?? 'Video'}
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
				allowfullscreen
			></iframe>
		</div>
	{/if}
</BlockSection>
