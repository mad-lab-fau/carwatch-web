<script lang="ts">
	import CsvDownload from "$lib/components/postprocessing/CsvDownload.svelte";
	import LogDropzone from "$lib/components/postprocessing/LogDropzone.svelte";

	let submitted = false;
	let downloadEnabled = false;
	let csvData = "";
</script>

<div class="container h-full mx-auto flex justify-center items-center">
	{#if !submitted}
		<LogDropzone bind:filesSubmitted={submitted} bind:downloadEnabled={downloadEnabled} bind:csvData={csvData}/>
	{:else}
		<CsvDownload bind:downloadEnabled={downloadEnabled} bind:csvData={csvData}/>	
	{/if}
</div>