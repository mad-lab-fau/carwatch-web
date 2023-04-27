<script lang="ts">
	import { Step, Stepper } from "@skeletonlabs/skeleton";
	import BarcodeForm from "$lib/forms/BarcodeForm.svelte";
	import QrCodeForm from "$lib/forms/QrCodeForm.svelte";
	import StudyForm from "$lib/forms/StudyForm.svelte";
	import { barcodePropsValid, studyPropsValid } from "$lib/configStore";
	import { goto } from "$app/navigation";

	function onCompleteHandler(e: CustomEvent<any>): void {
		goto("download");
	}
</script>

<div class="p-6">
 <h1>Study Configurator</h1>
 <br>

 <Stepper on:complete={onCompleteHandler}>
	<Step locked={!$studyPropsValid} type=submit>
		<svelte:fragment slot="header">Study Details</svelte:fragment>
        <StudyForm/>
	</Step>
	<Step locked={!$barcodePropsValid}>
		<svelte:fragment slot="header">Barcode Details</svelte:fragment>
		<BarcodeForm/>
	</Step>
    <Step locked={!$barcodePropsValid}>
		<svelte:fragment slot="header">Qr Code Details</svelte:fragment>
        <QrCodeForm/>
	</Step>
</Stepper>
</div>

  
  



