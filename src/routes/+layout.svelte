<script lang='ts'>
	import '@skeletonlabs/skeleton/styles/all.css';
	import '../app.postcss';
	import '../theme.postcss';

	import { AppRail, AppRailAnchor, AppShell, LightSwitch, Toast } from '@skeletonlabs/skeleton';
	import { page } from '$app/stores';
	import  Footer  from '$lib/components/general/Footer.svelte'
	import { base } from '$app/paths';
</script>

<Toast />

<AppShell>
	
	<svelte:fragment slot="sidebarLeft">
		<div class="print:hidden h-full">
		<AppRail width="w-28">
			<AppRailAnchor  href="{base}/" selected={$page.url.pathname === '/'}>
				<svelte:fragment slot="lead"><span class="material-symbols-outlined">home</span></svelte:fragment>
				<span>Home</span>
			</AppRailAnchor>
			<AppRailAnchor href="{base}/preparation" selected={$page.url.pathname === '/preparation'}>
				<svelte:fragment slot="lead"><span class="material-symbols-outlined">groups</span></svelte:fragment>
				<span>Study Configurator</span>
			</AppRailAnchor>
			<AppRailAnchor href="{base}/postprocessing" selected={$page.url.pathname === '/postprocessing'}>
				<svelte:fragment slot="lead"><span class="material-symbols-outlined">insert_chart</span></svelte:fragment>
				<span>Postprocessing</span>
			</AppRailAnchor>
			<svelte:fragment slot="trail">
				<LightSwitch class="mb-8 ml-8"/>
			</svelte:fragment>
		</AppRail>
		</div>
	</svelte:fragment>
	<svelte:fragment slot="pageFooter">
		<Footer />
	</svelte:fragment>
	<slot/>
	
</AppShell>