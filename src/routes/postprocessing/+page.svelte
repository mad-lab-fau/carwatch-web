<script lang="ts">
	import LogDropzone from "$lib/components/LogDropzone.svelte";

	let submitted = false;
	let downloadEnabled = false;
	let csvData = "";

	function downloadCsv(){
		const filename = 'study_results.csv';
		const blob = new Blob([csvData], { type: 'text/csv' });
		const url = URL.createObjectURL(blob);
		
		const a = document.createElement('a');
		a.href = url;
		a.download = filename;
		
		document.body.appendChild(a);
		a.click();
		
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	}
</script>

<div class="container h-full mx-auto flex justify-center items-center">
	{#if !submitted}
		<LogDropzone bind:filesSubmitted={submitted} bind:downloadEnabled={downloadEnabled} bind:csvData={csvData}/>
	{:else}
		<div class="container h-full mx-auto flex justify-center items-center text-center">
		<div class="w-1/2 space-y-6 my-6">
			<section class="w-full p-4 space-y-4">
				{#if downloadEnabled}
					<p>Processing finished!</p>
				{:else}
					<p>Files are being processed...</p>
				{/if}
			</section>
				<section class="w-full flex justify-center items-center">
					<button on:click={downloadCsv} type="button" class="btn variant-filled-primary p-6 mt-6" disabled={!downloadEnabled}>
						<span class="material-symbols-outlined">download</span>
						<span>Download CSV</span>
					</button>
				</section>
		</div>
	</div>
	{/if}
</div>