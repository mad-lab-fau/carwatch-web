<script lang="ts">
	import { CAR_STUDY, OTHER_STUDY } from "$lib/constants";
	import { studyProps, qrCodeProps, qrCodePropsValid } from "$lib/store";
	let uniformSalivaDistances = false;
	let salivaDistance = 15;
	let salivaDistances = [salivaDistance];
	$: if($studyProps.numSamples > 1 && $qrCodeProps.salivaDistances.length == 0) {
		salivaDistances = [...Array($studyProps.numSamples - 1)];
	} else {
		salivaDistances = [];
	}

	export const submit = () => {
		qrCodePropsValid.set(true);
		if (uniformSalivaDistances) {
			salivaDistances = salivaDistances.fill(salivaDistance);
		}
		else{
			for(let i = 0; i < salivaDistances.length; i++){
				let inputField = document.getElementById("salivaDistance_" + i);
				if (inputField instanceof HTMLInputElement){
					salivaDistances[i] = +inputField.value;
				}
			}
		}
		qrCodeProps.update((props) => {
			return {
				...props,
				generateQrCodes: props.generateQrCodes,
				contact: props.contact,
				checkDuplicates: props.checkDuplicates,
				enableManualScan: props.enableManualScan,
				salivaDistances: salivaDistances.toString()
		}});	
	}
</script>

{#if $studyProps.studyType == CAR_STUDY || $studyProps.studyType == OTHER_STUDY}
<form on:submit|preventDefault={submit}>
	<label>
		Generate QR codes for {$studyProps.studyName}?
		<input type="checkbox" bind:checked={$qrCodeProps.generateQrCodes}>
	</label>
	{#if $qrCodeProps.generateQrCodes}
	<label>
		Contact Email:
		<input type="email" bind:value={$qrCodeProps.contact} required>
	  </label>
	<label>
        Check for Duplicates?
        <input type="checkbox" bind:checked={$qrCodeProps.checkDuplicates}>
    </label>
	<label>
        Enable Manual Scanning Mode?
        <input type="checkbox" bind:checked={$qrCodeProps.enableManualScan}>
    </label>
	<label>
		Equal Distances between saliva samples?
		<input type="checkbox" bind:checked={uniformSalivaDistances}>
	</label>
	{#if uniformSalivaDistances}
	<label>
		Distance between saliva samples:
		<input type="number" bind:value={salivaDistance} min="1" max="99" step="1" required>
	</label>
	
	{/if}
	{#if !uniformSalivaDistances}
	<label>
		Distance between saliva samples (in minutes):
		<br>
	{#each salivaDistances as salivaDistance, i}
		{i} and {i + 1}:
		<input type="number" id="salivaDistance_{i}" value={salivaDistance} min="1" max="99" step="1" required>
		<br>
	{/each}
	</label>
	{/if}
    <button type="submit" class="btn variant-filled">Create QR-Codes</button>
	{/if}
</form>
{/if}