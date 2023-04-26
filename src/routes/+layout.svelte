<script lang='ts'>
	import '@skeletonlabs/skeleton/themes/theme-rocket.css';
	import '@skeletonlabs/skeleton/styles/all.css';
	import '../app.postcss';

	import { AppRail, AppRailTile, LightSwitch } from '@skeletonlabs/skeleton';
</script>

<div class="flex h-full">
	<AppRail class="print:hidden">
		<AppRailTile tag="a" href="/" label="Home" value={-1}>(icon)</AppRailTile>
		<AppRailTile tag="a" href="/preparation" label="Barcode Generator" value={0}>(icon)</AppRailTile>
		<AppRailTile tag="a" href="/postprocessing" label="Test" value={1}>(icon)</AppRailTile>
		<svelte:fragment slot="trail">
							<AppRailTile>
								<LightSwitch/>
							</AppRailTile>
		</svelte:fragment>
	</AppRail>
	
	<div class="w-full overflow-auto">
		<slot/>
	</div>
	
</div>



