<script lang="ts">
	import type { Snippet } from 'svelte';
	import Prose from './Prose.svelte';

	let {
		title,
		content,
		centered = false,
		children
	}: {
		title: string | null;
		content: string | null;
		centered?: boolean;
		children?: Snippet;
	} = $props();
</script>

<section class={['mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-10', centered && 'text-center']}>
	{#if title}
		<h2 class="text-4xl">{title}</h2>
	{/if}
	<Prose html={content} />
	{#if children}
		{@render children()}
	{/if}
</section>
