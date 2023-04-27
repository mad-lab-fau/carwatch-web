<script lang='ts'>
	import '@skeletonlabs/skeleton/themes/theme-rocket.css';
	import '@skeletonlabs/skeleton/styles/all.css';
	import '../app.postcss';

	import { AppRail, AppRailTile, LightSwitch } from '@skeletonlabs/skeleton';
</script>

<div class="flex h-full">
	<div class="print:hidden">
	<AppRail width="w-30">
		<AppRailTile tag="a" href="/" label="Home" value={-1}>
			<span class="material-symbols-outlined">home</span>
		</AppRailTile>
		<AppRailTile tag="a" href="/preparation" label="Study Configurator" value={0}>
			<span class="material-symbols-outlined">groups</span>
		</AppRailTile>
		<AppRailTile tag="a" href="/download" label="Study Material" value={1}>
			<span class="material-symbols-outlined">description</span>
		</AppRailTile>
		<AppRailTile tag="a" href="/postprocessing" label="Postprocessing" value={2}>
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
