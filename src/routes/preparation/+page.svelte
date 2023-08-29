<script lang="ts">
// @ts-nocheck

	import { Stepper } from "@skeletonlabs/skeleton";
	import { goto } from "$app/navigation";
	import { onMount } from "svelte";

	let StudyForm;
	let BarcodeForm;
	let QrCodeForm;

	onMount(async () => {
		StudyForm = (await import('$lib/components/preparation/StudyForm.svelte')).default;
		BarcodeForm = (await import('$lib/components/preparation/BarcodeForm.svelte')).default;
		QrCodeForm = (await import('$lib/components/preparation/QrCodeForm.svelte')).default;
	});


	function onCompleteHandler(e: CustomEvent<any>): void {
		goto("download");
	}


</script>

<div class="p-6 h-full">
	<div class="flex items-center justify-center h-full">
		<Stepper on:complete={onCompleteHandler} class="w-5/6">
			<svelte:component this={StudyForm}/>
			<svelte:component this={BarcodeForm}/>
			<svelte:component this={QrCodeForm}/>
		</Stepper>
	</div>
</div>

  
  



