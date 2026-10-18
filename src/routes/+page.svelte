<script lang="ts">
	import PageContent from '#lib/components/blocks/PageContent.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<PageContent page={data.page} />
