<script lang="ts">
	import BlockSection from './BlockSection.svelte';

	let { title, content }: { title: string | null; content: string | null } = $props();
</script>

<BlockSection {title} {content} />
