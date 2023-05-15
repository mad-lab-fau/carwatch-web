<script lang="ts">
	import { Step, Stepper } from "@skeletonlabs/skeleton";
	import BarcodeForm from "$lib/forms/BarcodeForm.svelte";
	import QrCodeForm from "$lib/forms/QrCodeForm.svelte";
	import StudyForm from "$lib/forms/StudyForm.svelte";
	import { goto } from "$app/navigation";

	function onCompleteHandler(e: CustomEvent<any>): void {
		goto("download");
	}


</script>

<div class="p-6 h-full">
	<div class="flex items-center justify-center h-full">
		<Stepper on:complete={onCompleteHandler} class="w-5/6">
			<StudyForm/>
			<BarcodeForm/>
  		  	<QrCodeForm/>
		</Stepper>
	</div>
</div>

  
  



