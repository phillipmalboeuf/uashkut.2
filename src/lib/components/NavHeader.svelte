<script lang="ts">
	import type { Path } from '$app/types';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import {
		deLocalizeHref,
		getLocale,
		locales,
		localizeHref,
		setLocale
	} from '#lib/paraglide/runtime.js';
	import type { NavLink } from '#lib/content/types.ts';
	import ExternalIcon from './ExternalIcon.svelte';

	let { links }: { links: NavLink[] } = $props();

	let currentPath = $derived(deLocalizeHref(page.url.pathname));
</script>

{#snippet items()}
	{#each links as link (link.id)}
		<li class="join-item btn btn-primary">
			{#if link.external}
				<a href={link.href} target="_blank" rel="noopener noreferrer">
					{link.label}
					<ExternalIcon />
				</a>
			{:else}
				<a
					href={resolve(localizeHref(link.href) as Path)}
					class={['', { 'menu-active': currentPath === link.href }]}
					aria-current={currentPath === link.href ? 'page' : undefined}
				>{link.label}</a>
			{/if}
		</li>
	{/each}
{/snippet}

<header class="navbar px-4 fixed top-0 left-0 right-0 z-50">
	<div class="navbar-start">
		<div class="dropdown">
			<div tabindex="0" role="button" class="btn btn-ghost lg:hidden" aria-label="Menu">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					stroke-width="2"
					class="size-5"
					aria-hidden="true"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
				</svg>
			</div>
			<ul
				tabindex="-1"
				class="menu menu-sm dropdown-content z-10 mt-3 w-52 rounded-box bg-base-200 p-2 shadow"
			>
				{@render items()}
			</ul>
		</div>
		<a href={resolve(localizeHref('/') as Path)} class="btn btn-ghost text-xl font-heading! uppercase">Uashkut</a>
	</div>

	<nav class="navbar-center hidden lg:flex">
		<ul class="join">
			{@render items()}
		</ul>
	</nav>

	<div class="navbar-end gap-2">
		{#each locales as locale (locale)}
			<a
				class={['btn btn-sm uppercase', locale === getLocale() ? 'btn-primary' : 'btn-ghost']}
				href={resolve(localizeHref(page.url.pathname, { locale }) as Path)}
				hreflang={locale}
				onclick={(event) => {
					event.preventDefault();
					setLocale(locale);
				}}
			>{locale}</a>
		{/each}
	</div>
</header>
