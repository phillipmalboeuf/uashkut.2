<script lang="ts">
	import DemoLinks from './demo/DemoLinks.svelte';
	import NavHeader from '#lib/components/NavHeader.svelte';
	import './layout.css';
	import favicon from '#lib/assets/favicon.svg';
	import type { LayoutProps } from './$types';

	let { data, children }: LayoutProps = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<NavHeader links={data.navigation} />

{@render children()}

<!-- <DemoLinks /> -->
