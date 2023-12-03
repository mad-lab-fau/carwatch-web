<script lang="ts">
	import {
		CAR_STUDY,
		DEFAULT_IS_TIME_OF_DAY,
		DEFAULT_SALIVA_DISTANCE,
		DEFAULT_SALIVA_TIME,
		DEFAULT_SAMPLES_ABS_TIME,
		OTHER_STUDY
	} from "$lib/constants";
	import { studyProps, qrCodeProps, qrCodePropsValid } from '$lib/stores/configStore';
	import { Step, RadioGroup, RadioItem } from '@skeletonlabs/skeleton';
	import { onMount, afterUpdate } from 'svelte';

	let uniformSalivaDistances = true;
	let uniformSalivaDistance = DEFAULT_SALIVA_DISTANCE;
	let samplesAbsTime = DEFAULT_SAMPLES_ABS_TIME;
	let salivaDistances: number[];
	let salivaTimes: string[];
	let isTimeOfDay: boolean[];

	onMount(() => {
		// to prevent continuing with invalid settings
		qrCodeProps.update((props) => {
			return {
				...props,
				generateQrCodes: false
			};
		});
		initializeSalivaTimes();
		qrCodePropsValid.set(isValid());
	});
	afterUpdate(() => qrCodePropsValid.set(isValid()));

	// every time the store value changes, check if input is valid
	$: $qrCodeProps, qrCodePropsValid.set(isValid());

	// every time saliva distance is modified, check if input is valid
	$: uniformSalivaDistance, qrCodePropsValid.set(isValid());

	// every time the number of samples changes, regenerate saliva times array
	$: $studyProps.numSamples, initializeSalivaTimes();

	function initializeSalivaTimes() {
		uniformSalivaDistances = false;
		if (!$qrCodeProps.salivaDistances || $qrCodeProps.salivaDistances.length != $studyProps.numSamples) {
			salivaDistances = [...Array(Math.floor(Number($studyProps.numSamples)))].fill(DEFAULT_SALIVA_DISTANCE);
			// use values from storage
		} else {
			salivaDistances = $qrCodeProps.salivaDistances;
		}
		if (!$qrCodeProps.salivaTimes || $qrCodeProps.salivaTimes.length != $studyProps.numSamples) {
			salivaTimes = [...Array(Math.floor(Number($studyProps.numSamples)))].fill(DEFAULT_SALIVA_TIME);
			// use values from storage
		} else {
			salivaTimes = $qrCodeProps.salivaTimes;
		}
		if (!$qrCodeProps.isTimeOfDay || $qrCodeProps.isTimeOfDay.length != $studyProps.numSamples) {
			isTimeOfDay = [...Array(Math.floor(Number($studyProps.numSamples)))].fill(DEFAULT_IS_TIME_OF_DAY);
			// use values from storage
		} else {
			isTimeOfDay = $qrCodeProps.isTimeOfDay;
		}
	}

	function isValid() {
		let idList = ['mail'];
		if (uniformSalivaDistances) {
			idList = [...idList, 'distances'];
		} else {
			for (let i = 0; i < salivaDistances.length; i++) {
				idList = [...idList, 'distance' + i];
				idList = [...idList, 'time' + i];
			}
		}
		for (let id of idList) {
			let element = document.getElementById(id);
			if (element instanceof HTMLInputElement && !element.reportValidity()) {
				return false;
			}
		}
		if (isTimeOfDay && (salivaDistances || salivaTimes)) {
			submitQrCodeProps();
		}
		return true;
	}

	function salivaListChanged() {
		qrCodePropsValid.set(isValid());
	}

	const submitQrCodeProps = () => {
		if (uniformSalivaDistances) {
			salivaDistances = salivaDistances.fill(uniformSalivaDistance)
			isTimeOfDay = isTimeOfDay.fill(false)
		}
		qrCodeProps.update((props) => {
			return {
				...props,
				salivaDistances: salivaDistances,
				salivaTimes: salivaTimes,
				isTimeOfDay: isTimeOfDay,
			};
		});
	};
</script>

{#if $studyProps.studyType === CAR_STUDY || $studyProps.studyType === OTHER_STUDY}
	<Step locked={!$qrCodePropsValid}>
		<svelte:fragment slot="header">Qr Code Details</svelte:fragment>
		<form id="qr_code_form">
			<label class="label">
				<input class="checkbox" type="checkbox" bind:checked={$qrCodeProps.generateQrCodes} />
				Generate QR codes for study
			</label>

			<hr class="my-4">
			
			{#if $qrCodeProps.generateQrCodes}
				<label class="label md:w-1/3">
					<span>Contact Email</span>
					<input class="input" id="mail" type="email" bind:value={$qrCodeProps.contact} required />
				</label>

				<hr class="my-4">

				<div class="space-y-2">
					<label class="flex items-center space-x-2">
						<input class="checkbox" type="checkbox" bind:checked={$qrCodeProps.checkDuplicates} />
						<p>Enable check for duplicate barcode scanning (scanning the same barcode twice will result in error message)</p>
					</label>
					<label class="flex items-center space-x-2">
						<input class="checkbox" type="checkbox" bind:checked={$qrCodeProps.enableManualScan} />
						<p>Enable manual scanning mode (allows to manually scan barcodes apart from being prompted by the <i>CARWatch</i> application)</p>
					</label>

					{#if $studyProps.numSamples > 1}
						<hr class="my-4">
						<h4>Specify biomarker sampling times</h4>

						<label class="flex items-center space-x-2">
							<input class="checkbox" type="checkbox" bind:checked={uniformSalivaDistances} />
							<p>Equidistant sampling times</p>
						</label>
					{/if}
				</div>

				<hr class="my-4">

				{#if !uniformSalivaDistances}
					<label class="label md:w-1/3">
						<span>Number of samples that have to be taken at a specific time</span>
						<input
							class="input md:w-1/4"
							id="samplesAbsTime"
							type="number"
							bind:value={samplesAbsTime}
							min="0"
							max="{$studyProps.numSamples}"
							required />
					</label>
					<hr class="my-4">
				{/if}

				{#if $studyProps.numSamples > 1}
				<p><b>Time between biomarker samples</b></p>
					{#if uniformSalivaDistances}
						<div class="h-full max-h-72 md:w-1/4 overflow-y-auto overflow-x-hidden flex flex-col flex-grow px-4">
							<label class="label">
								<span>All samples</span>
								<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
									<input
										class="input col-span-2"
										id="distances"
										type="number"
										bind:value={uniformSalivaDistance}
										min="1"
										max="99"
										step="1"
										required
									/>
									<div class="input-group-shim col-span-1">min</div>
								</div>
							</label>
						</div>
					{:else}
						<div class="h-full md:w-1/3 overflow-y-auto overflow-x-hidden flex flex-col flex-grow px-4">
							{#each Array($studyProps.numSamples - samplesAbsTime) as _, i}
								<label class="label pt-2 pb-1" for="distance{i}"><span>Sample {i + 1}</span></label>
								<div class="input-group input-group-divider grid-cols-[auto_2fr_auto]">
									<input
										class="input col-span-2"
										id="distance"
										type="number"
										bind:value={salivaDistances[i]}
										on:input={salivaListChanged}/>
									<div class="input-group-shim">min</div>
								</div>
							{/each}
						</div>
					{/if}
				{/if}
			{/if}
		</form>
	</Step>
{/if}
