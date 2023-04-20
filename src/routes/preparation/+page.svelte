<script lang="ts">
	import { Step, Stepper } from "@skeletonlabs/skeleton";
	import BarcodeForm from "./BarcodeForm.svelte";
	import QrCodeForm from "./QrCodeForm.svelte";
	import StudyForm from "./StudyForm.svelte";
	import { barcodePropsValid, studyPropsValid } from "$lib/store";

	


	function onCompleteHandler(e: CustomEvent<any>): void {
		throw new Error("Function not implemented.");
	}
</script>

 <h1>Study Configurator</h1>
 <br>
 <h2>locked value: {$studyPropsValid}</h2>

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



  
  



