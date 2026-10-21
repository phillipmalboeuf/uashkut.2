<script lang="ts">
	import BlockSection from './BlockSection.svelte';

	let {
		title,
		content,
		centered
	}: { title: string | null; content: string | null; centered: boolean } = $props();
</script>

<BlockSection {title} {content} {centered} />
