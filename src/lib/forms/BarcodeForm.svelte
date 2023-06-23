<script lang="ts">
	import { barcodeProps, barcodePropsValid, studyProps} from "$lib/configStore";
	import { Step } from "@skeletonlabs/skeleton";
	import { onMount, afterUpdate } from "svelte";

	onMount(() => {
		// to prevent contunuing with invalid settings
		barcodeProps.update((props) => {
				return {
					...props,
					generateBarcodes: false
			}});	
		barcodePropsValid.set(isValid());
	});
	// after hiding/showing conditional form elements
	afterUpdate(()=> barcodePropsValid.set(isValid()));

	// every time the store value changes, check if input is valid
    $: $barcodeProps, barcodePropsValid.set(isValid());
	
	function isValid(){
		if($barcodeProps.generateBarcodes){
			let idList = ["num_col", "num_row", "left_m", "right_m", "top_m", "bottom_m", "col_dist", "row_dist"]
			for(let id of idList) {
				let element = document.getElementById(id);
				if(element instanceof HTMLInputElement){
					if(!(element.reportValidity())){
						return false;
					}
				}
			}
		}
		return true;
    }    
</script>
<Step locked={!$barcodePropsValid}>
	<svelte:fragment slot="header">Barcode Details</svelte:fragment>

	<form id="barcode_form">
		<label class="flex items-center space-x-2">
			<input class="checkbox" id="generate_labels" type="checkbox" bind:checked={$barcodeProps.generateBarcodes}>
			<p>Generate labels for {$studyProps.studyName}</p>
		</label>
		{#if $barcodeProps.generateBarcodes}
		<label class="flex items-center space-x-2">
			<input class="checkbox" id="add_details" type="checkbox" bind:checked={$barcodeProps.addName}>
			<p>Add study name to label<p>
		</label>
		<label class="flex items-center space-x-2">
			<input class="checkbox" id="addr_barcodes" type="checkbox" bind:checked={$barcodeProps.hasBarcode}>
			<p>Add barcode to label<p>
		</label>
		<br>
		<h4>Print label layout:</h4>
		<div class="flex">
      		<div class="w-1/4">
				<label class="label">
					<span>Number of columns</span>
					<input class="input col-span-2" id="num_col" type="number" bind:value={$barcodeProps.numCols} min="1" step="1" required>
				</label> 
			</div>
   	 		<div class="w-1/4 mx-6">
				<label class="label">
					<span>Number of rows</span>
					<input class="input" id="num_row" type="number" bind:value={$barcodeProps.numRows} min="1" step="1" required>
				</label> 
			</div>
			<div class="w-1/4 mr-6">
				<label class="label">
					<span>Distance between columns</span>
						<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
							<input class="input col-span-2" id="col_dist" type="number" bind:value={$barcodeProps.colDist} required>
							<div class="input-group-shim col-span-1">mm</div>
						</div>
				</label>
			</div>
      		<div class="w-1/4">
				<label class="label">
					<span>Distance between rows</span>
						<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
							<input class="input col-span-2" id="row_dist" type="number" bind:value={$barcodeProps.rowDist} required>
							<div class="input-group-shim col-span-1">mm</div>
						</div>
				</label>
			</div>   		
		</div>
		<div class="flex">
			<div class="w-1/4">
				<label class="label">
					<span>Left margin</span>
						<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
							<input class="input col-span-2" id="left_m" type="number" bind:value={$barcodeProps.leftMargin} required>
							<div class="input-group-shim col-span-1">mm</div>
						</div>
				</label>
			</div>
			<div class="w-1/4 mx-6">
				<label class="label">
					<span>Right margin</span>
						<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
							<input class="input col-span-2" id="right_m" type="number" bind:value={$barcodeProps.rightMargin} required>
							<div class="input-group-shim col-span-1">mm</div>
						</div>
				</label>
			</div>
			<div class="w-1/4 mr-6">
				<label class="label">
					<span>Top margin</span>
						<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
							<input class="input col-span-2" id="top_m" type="number" bind:value={$barcodeProps.topMargin} required>
							<div class="input-group-shim col-span-1">mm</div>
						</div>
				</label>
			</div>
			<div class="w-1/4">
				<label class="label">
					<span>Bottom margin</span>
						<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
							<input class="input col-span-2" id="bottom_m" type="number" bind:value={$barcodeProps.bottomMargin} required>
							<div class="input-group-shim col-span-1">mm</div>
						</div>
				</label>
			</div>
		</div>
		{/if}
	</form>
</Step>