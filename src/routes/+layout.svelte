<script lang='ts'>
	import '@skeletonlabs/skeleton/themes/theme-rocket.css';
	import '@skeletonlabs/skeleton/styles/all.css';
	import '../app.postcss';

	import { AppRail, AppRailAnchor, AppShell, LightSwitch } from '@skeletonlabs/skeleton';
	import { page } from '$app/stores';
</script>
 
<AppShell>
	
	<svelte:fragment slot="sidebarLeft">
		<div class="print:hidden h-full">
		<AppRail width="w-28">
			<AppRailAnchor  href="/" selected={$page.url.pathname === '/'}>
				<svelte:fragment slot="lead"><span class="material-symbols-outlined">home</span></svelte:fragment>
				<span>Home</span>
			</AppRailAnchor>
			<AppRailAnchor href="/preparation" selected={$page.url.pathname === '/preparation'}>
				<svelte:fragment slot="lead"><span class="material-symbols-outlined">groups</span></svelte:fragment>
				<span>Study Configurator</span>
			</AppRailAnchor>
			<AppRailAnchor href="/postprocessing" selected={$page.url.pathname === '/postprocessing'}>
				<svelte:fragment slot="lead"><span class="material-symbols-outlined">insert_chart</span></svelte:fragment>
				<span>Postprocessing</span>
			</AppRailAnchor>
			<svelte:fragment slot="trail">
				<LightSwitch class="mb-8 ml-8"/>
			</svelte:fragment>
		</AppRail>
		</div>
	</svelte:fragment>
	<slot/>
	
</AppShell>