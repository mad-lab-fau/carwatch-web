<script lang="ts">
	import { FileDropzone } from '@skeletonlabs/skeleton';

	export let files: FileList = <FileList>{};
	export let filesUploaded: boolean = false;
	export let filesSubmitted: boolean = false;
	console.log(filesSubmitted);

	function handleUpload(e: Event) {
		filesUploaded = true;
	}

	function handleSubmit() {
		filesSubmitted = true;
        console.log("submit: " + filesSubmitted);
	}
</script>

<form class="container h-full mx-auto flex justify-center items-center" on:submit|preventDefault={handleSubmit}>
		<div class="w-1/2 space-y-6 my-6">
			<FileDropzone
				name="file"
				id="file"
				bind:files
				on:change={handleUpload}
				accept=".zip"
				multiple
			>
				<svelte:fragment slot="lead">
					<span class="material-symbols-outlined">upload_file</span>
				</svelte:fragment>
				<svelte:fragment slot="message"><b>Upload files</b> or drag and drop.</svelte:fragment>
				<svelte:fragment slot="meta">Select all participant ZIP-files to evaluate.</svelte:fragment>
			</FileDropzone>
			<section class="w-full text-token card p-4 space-y-4">
				{#if !files}
					<p class="font-bold text-center">No files selected.</p>
				{:else}
					<p class="font-bold">Selected files</p>
					<ul class="list">
						{#each { length: files.length } as _, i}
							<li>
								<span class="badge-icon p-4 variant-soft-tertiary">
									<span class="material-symbols-outlined"> contact_page </span>
								</span>
								<span class="flex-auto">{files[i].name}</span>
							</li>
						{/each}
					</ul>
				{/if}
			</section>
			<section class="w-full flex justify-end items-end">
				<button type="submit" class="btn variant-filled-primary p-2" disabled={!filesUploaded}>
					<span>Start Processing</span>
				</button>
			</section>
		</div>
</form>
