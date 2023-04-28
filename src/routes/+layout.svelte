<script lang='ts'>
	import '@skeletonlabs/skeleton/themes/theme-rocket.css';
	import '@skeletonlabs/skeleton/styles/all.css';
	import '../app.postcss';

	import { AppRail, AppRailTile, LightSwitch } from '@skeletonlabs/skeleton';
	import { MENU_PREPARE, MENU_HOME, MENU_POSTPROCESS } from '$lib/constants';
</script>

<div class="flex h-full">
	<div class="print:hidden">
	<AppRail width="w-30">
		<AppRailTile tag="a" href="/" label="Home" value={MENU_HOME}>
			<span class="material-symbols-outlined">home</span>
		</AppRailTile>
		<AppRailTile tag="a" href="/preparation" label="Study Preparation" value={MENU_PREPARE}>
			<span class="material-symbols-outlined">groups</span>
		</AppRailTile>
		<AppRailTile tag="a" href="/postprocessing" label="Postprocessing" value={MENU_POSTPROCESS}>
			<span class="material-symbols-outlined">insert_chart</span>
		</AppRailTile>
		<svelte:fragment slot="trail">
			<LightSwitch class="mb-6 ml-6"/>
		</svelte:fragment>
	</AppRail>
	</div>
	<div class="w-full">
		<slot/>
	</div>
	
</div>
