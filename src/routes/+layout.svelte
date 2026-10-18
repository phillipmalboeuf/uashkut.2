<script lang="ts">
	import DemoLinks from './demo/DemoLinks.svelte';
	import type { Path } from '$app/types';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { getLocale, locales, localizeHref, setLocale } from '#lib/paraglide/runtime.js';
	import './layout.css';
	import favicon from '#lib/assets/favicon.svg';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<nav class="flex justify-end gap-2 p-4">
	{#each locales as locale (locale)}
		<a
			class={['btn btn-sm', locale === getLocale() ? 'btn-primary' : 'btn-ghost']}
			href={resolve(localizeHref(page.url.pathname, { locale }) as Path)}
			hreflang={locale}
			onclick={(event) => {
				event.preventDefault();
				setLocale(locale);
			}}
		>{locale}</a>
	{/each}
</nav>

{@render children()}

<!-- <DemoLinks /> -->
