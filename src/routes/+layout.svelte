<script lang='ts'>
	// The ordering of these imports is critical to your app working properly
	import '@skeletonlabs/skeleton/themes/theme-rocket.css';
	// If you have source.organizeImports set to true in VSCode, then it will auto change this ordering
	import '@skeletonlabs/skeleton/styles/all.css';
	// Most of your app wide CSS should be put in this file
	import '../app.postcss';

	import { AppRail, AppRailTile } from '@skeletonlabs/skeleton';
</script>

<div class="flex h-full">
	<AppRail>
		<AppRailTile tag="a" href="/" label="Home" value={-1}>(icon)</AppRailTile>
		<AppRailTile tag="a" href="/preparation" label="Barcode Generator" value={0}>(icon)</AppRailTile>
		<AppRailTile tag="a" href="/postprocessing" label="Test" value={1}>(icon)</AppRailTile>

	</AppRail>
	<div class="w-full overflow-auto">
		<slot/>
	</div>
	
</div>
