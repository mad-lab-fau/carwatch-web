<script lang="ts">
	import LogDropzone from "$lib/components/LogDropzone.svelte";

	let submitted = false;
</script>
<div class="container h-full mx-auto flex justify-center items-center">
	{#if !submitted}
		<LogDropzone bind:filesSubmitted={submitted}/>
	{:else}
		<p>Files submitted</p>
	{/if}
</div>