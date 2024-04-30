<script lang="ts">
	import { type BarcodeLayoutPreset, PRESETS } from "$lib/barcodeLayoutPresets";
	import { barcodeProps, barcodePropsValid} from "$lib/stores/configStore";
	import { Step } from "@skeletonlabs/skeleton";
	import { onMount, afterUpdate } from "svelte";

	let layoutPresetId: string;
	const customPresetId = "custom";

	onMount(() => {
		// to prevent continuing with invalid settings
		barcodeProps.update((props) => {
				return {
					...props,
					generateBarcodes: false
			}});
		barcodePropsValid.set(isValid());
		layoutPresetId = getCurrentPresetIdFromValues();
	});
	// after hiding/showing conditional form elements
	afterUpdate(()=> barcodePropsValid.set(isValid()));

	// every time the store value changes, check if input is valid
  $: $barcodeProps, barcodePropsValid.set(isValid());
	let printFormat = $barcodeProps.useLetterFormat ? "letter" : "A4";
	let presets = PRESETS.filter((preset) => preset.printFormat === printFormat);

	function isValid(){
		if($barcodeProps.generateBarcodes){
			let idList = ["num_col", "num_row", "left_m", "right_m", "top_m", "bottom_m", "col_dist", "row_dist"]
			for(let id of idList) {
				let element = document.getElementById(id);
				if(element instanceof HTMLInputElement){
					if(!element.checkValidity()){
						return false;
					}
				}
			}
		}
		return true;
    }

	function changePrintFormat() {
		printFormat = $barcodeProps.useLetterFormat ? "letter" : "A4";
		presets = PRESETS.filter((preset) => preset.printFormat === printFormat);
		layoutPresetId = getCurrentPresetIdFromValues();
	}

	function insertPresetValues() {
		if (layoutPresetId === customPresetId)
			return;

		const preset = presets.find((preset) => preset.id === layoutPresetId) as BarcodeLayoutPreset;
		barcodeProps.update((props) => {
			return {
				...props,
				numCols: preset.numCols,
				numRows: preset.numRows,
				colDist: preset.distanceBetweenCols,
				rowDist: preset.distanceBetweenRows,
				leftMargin: preset.leftMargin,
				rightMargin: preset.rightMargin,
				topMargin: preset.topMargin,
				bottomMargin: preset.bottomMargin
			}
		});
	}

	function getCurrentPresetIdFromValues() {
		for (let preset of presets) {
			if (preset.numCols === $barcodeProps.numCols &&
				preset.numRows === $barcodeProps.numRows &&
				preset.distanceBetweenCols === $barcodeProps.colDist &&
				preset.distanceBetweenRows === $barcodeProps.rowDist &&
				preset.leftMargin === $barcodeProps.leftMargin &&
				preset.rightMargin === $barcodeProps.rightMargin &&
				preset.topMargin === $barcodeProps.topMargin &&
				preset.bottomMargin === $barcodeProps.bottomMargin) {
				return preset.id;
			}
		}
		return customPresetId;
	}

	function setCustomPreset() {
		layoutPresetId = customPresetId;
	}
</script>
<Step locked={!$barcodePropsValid}>
	<svelte:fragment slot="header">Barcode Details</svelte:fragment>

	<form id="barcode_form">
		<label class="flex items-center space-x-2">
			<input class="checkbox" id="generate_labels" type="checkbox" bind:checked={$barcodeProps.generateBarcodes}>
			<p>Generate labels for study</p>
		</label>

		{#if $barcodeProps.generateBarcodes}
		<hr class="my-4">
		<label class="flex items-center space-x-2">
			<input class="checkbox" id="add_details" type="checkbox" bind:checked={$barcodeProps.addName}>
			<p>Add study name to labels<p>
		</label>
		<label class="flex items-center space-x-2">
			<input class="checkbox" id="addr_barcodes" type="checkbox" bind:checked={$barcodeProps.hasBarcode}>
			<p>Add barcodes to labels<p>
		</label>
		<hr class="my-4">
		<h4>Print label layout:</h4>
		<label class="flex items-center space-x-2 my-3">
			<input class="checkbox" id="use_letter_format" type="checkbox" bind:checked={$barcodeProps.useLetterFormat} on:change={changePrintFormat}>
			<p>Use ANSI letter format (11 in &times; 8.5 in) instead of A4 (297 mm &times; 210 mm)</p>
		</label>
		<label class="label md:w-1/3 my-4">
			<span>Layout preset</span>
			<select class="select" name="studyType" bind:value={layoutPresetId} on:change={insertPresetValues}>
				<option value="{customPresetId}">Custom</option>
				{#each presets as preset}
					<option value={preset.id}>{preset.name} ({preset.labelsPerPage} labels per page)</option>
				{/each}
			</select>
		</label>
		<div class="flex">
			<div class="w-1/4">
				<label class="label">
					<span>Number of columns</span>
					<input class="input col-span-2" id="num_col" type="number" bind:value={$barcodeProps.numCols} on:change={setCustomPreset} min="1" step="1" required>
				</label>
			</div>
			<div class="w-1/4 mx-6">
				<label class="label">
					<span>Number of rows</span>
					<input class="input" id="num_row" type="number" bind:value={$barcodeProps.numRows} on:change={setCustomPreset} min="1" step="1" required>
				</label>
			</div>
			<div class="w-1/4 mr-6">
				<label class="label">
					<span>Distance between columns</span>
					<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
						<input class="input col-span-2" id="col_dist" type="number" bind:value={$barcodeProps.colDist} on:change={setCustomPreset} step="0.1" required>
						<div class="input-group-shim col-span-1">mm</div>
					</div>
				</label>
			</div>
      		<div class="w-1/4">
				<label class="label">
					<span>Distance between rows</span>
					<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
						<input class="input col-span-2" id="row_dist" type="number" bind:value={$barcodeProps.rowDist} on:change={setCustomPreset} step="0.1" required>
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
						<input class="input col-span-2" id="left_m" type="number" bind:value={$barcodeProps.leftMargin} on:change={setCustomPreset} step="0.1" required>
						<div class="input-group-shim col-span-1">mm</div>
					</div>
				</label>
			</div>
			<div class="w-1/4 mx-6">
				<label class="label">
					<span>Right margin</span>
					<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
						<input class="input col-span-2" id="right_m" type="number" bind:value={$barcodeProps.rightMargin} on:change={setCustomPreset} step="0.1" required>
						<div class="input-group-shim col-span-1">mm</div>
					</div>
				</label>
			</div>
			<div class="w-1/4 mr-6">
				<label class="label">
					<span>Top margin</span>
						<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
							<input class="input col-span-2" id="top_m" type="number" bind:value={$barcodeProps.topMargin} on:change={setCustomPreset} step="0.1" required>
							<div class="input-group-shim col-span-1">mm</div>
						</div>
				</label>
			</div>
			<div class="w-1/4">
				<label class="label">
					<span>Bottom margin</span>
						<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
							<input class="input col-span-2" id="bottom_m" type="number" bind:value={$barcodeProps.bottomMargin} on:change={setCustomPreset} step="0.1" required>
							<div class="input-group-shim col-span-1">mm</div>
						</div>
				</label>
			</div>
		</div>
		{/if}
	</form>
</Step>