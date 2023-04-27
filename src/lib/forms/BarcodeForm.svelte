<script lang="ts">
	import { barcodeProps, barcodePropsValid, studyProps} from "$lib/configStore";
	import NumericInput from "$lib/utils/NumericInput.svelte";

	export const submit = () => {
		barcodePropsValid.set(true);
		barcodeProps.update((props) => {
			return {
				...props,
				generateBarcodes: props.generateBarcodes,
				addName: props.addName,
				hasBarcode: props.hasBarcode,
				layout: props.layout
			}
		})
	}
</script>

<form on:submit|preventDefault={submit} method=POST>
	<label>
        Generate labels for {$studyProps.studyName}?
        <input type="checkbox" bind:checked={$barcodeProps.generateBarcodes}>
    </label>
	<label>
        Add study name and participant ID to every barcode?
        <input type="checkbox" bind:checked={$barcodeProps.addName}>
    </label>
	<label>
		Add barcode to label?
		<input type="checkbox" bind:checked={$barcodeProps.hasBarcode}>
	</label>
	<div class="card p-4" style="width: 33%">
		Print label layout:
		<NumericInput labelName="Number of columns" value={$barcodeProps.layout.numCols} isRequired={true} isInt={true}/>	
		<NumericInput labelName="Number of rows" value={$barcodeProps.layout.numRows} isRequired={true} isInt={true}/>	
		<NumericInput labelName="Left margin [mm]" value={$barcodeProps.layout.leftMargin} isRequired={true} isInt={false}/>	
		<NumericInput labelName="Right margin [mm]" value={$barcodeProps.layout.rightMargin} isRequired={true} isInt={false}/>	
		<NumericInput labelName="Top margin [mm]" value={$barcodeProps.layout.topMargin} isRequired={true} isInt={false}/>	
		<NumericInput labelName="Bottom margin [mm]" value={$barcodeProps.layout.bottomMargin} isRequired={true} isInt={false}/>	
		<NumericInput labelName="Distance between columns [mm]" value={$barcodeProps.layout.colDist} isRequired={true} isInt={false}/>	
		<NumericInput labelName="Distance between rows [mm]" value={$barcodeProps.layout.rowDist} isRequired={true} isInt={false}/>	
	</div>
    <button type="submit" class="btn variant-filled-primary">Create Barcodes</button>
</form>