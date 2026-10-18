<script lang="ts">
	import { m } from '#lib/paraglide/messages.js';
	import type { DownloadFile } from '#lib/content/types.ts';
	import BlockSection from './BlockSection.svelte';

	let {
		title,
		content,
		files
	}: {
		title: string | null;
		content: string | null;
		files: DownloadFile[];
	} = $props();
</script>

<BlockSection {title} {content}>
	<ul class="list rounded-box bg-base-200 shadow-md">
		{#each files as file (file.id)}
			<li class="list-row">
				<div class="list-col-grow">
					<div class="font-semibold">{file.title}</div>
					{#if file.description}
						<p class="text-sm opacity-70">{file.description}</p>
					{/if}
				</div>
				<a class="btn btn-primary" href={file.href}>{m.download()}</a>
			</li>
		{/each}
	</ul>
</BlockSection>
