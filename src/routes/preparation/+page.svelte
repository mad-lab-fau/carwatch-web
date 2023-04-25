<script lang="ts">
	import { Step, Stepper } from "@skeletonlabs/skeleton";
	import BarcodeForm from "./BarcodeForm.svelte";
	import QrCodeForm from "./QrCodeForm.svelte";
	import StudyForm from "./StudyForm.svelte";
	import { barcodePropsValid, studyPropsValid } from "$lib/configStore";
	import { goto } from "$app/navigation";

	function onCompleteHandler(e: CustomEvent<any>): void {
		goto("preparation/results");
	}
</script>

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



  
  



