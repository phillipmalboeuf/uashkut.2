<script lang="ts">
	let { html }: { html: string | null } = $props();
</script>

{#if html}
	<div class="prose prose-invert max-w-none overflow-x-auto">
		{@html html}
	</div>
{/if}
