<script lang="ts">
	import { CAR_STUDY, DEFAULT_SALIVA_DISTANCE, OTHER_STUDY } from '$lib/constants';
	import { studyProps, qrCodeProps, qrCodePropsValid } from '$lib/configStore';
	import { Step } from '@skeletonlabs/skeleton';
	import { onMount, afterUpdate } from 'svelte';

	let uniformSalivaDistances = true;
	let salivaDistance = DEFAULT_SALIVA_DISTANCE;
	let salivaDistances: number[];

	onMount(() => {
		// to prevent contunuing with invalid settings
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
	$: salivaDistance, qrCodePropsValid.set(isValid());

	// every time the number of samples changes, regenererate saliva times array
	$: $studyProps.numSamples, initializeSalivaTimes();

	function initializeSalivaTimes() {
		uniformSalivaDistances = false;
		if ($studyProps.numSamples > 1) {
			// first initialization
			if ($qrCodeProps.salivaDistances.length != $studyProps.numSamples - 1) {
				salivaDistances = [...Array(Math.floor(Number($studyProps.numSamples)) - 1)];
				// use values from storage
			} else {
				salivaDistances = $qrCodeProps.salivaDistances;
			}
		} else {
			salivaDistances = [];
		}
	}

	function isValid() {
		let idList = ['mail'];
		if (uniformSalivaDistances) {
			idList = [...idList, 'distances'];
		} else {
			for (let i = 0; i < salivaDistances.length; i++) {
				idList = [...idList, 'distance' + i];
			}
		}
		for (let id of idList) {
			let element = document.getElementById(id);
			if (element instanceof HTMLInputElement) {
				if (!element.reportValidity()) {
					return false;
				}
			}
		}
		if(salivaDistances){
			submitQrCodeProps();
		}
		return true;
	}

	function salivaListChanged() {
		qrCodePropsValid.set(isValid());
	}

	const submitQrCodeProps = () => {
		if (uniformSalivaDistances) {
			salivaDistances = salivaDistances.fill(salivaDistance);
		} else {
			for (let i = 0; i < salivaDistances.length; i++) {
				let inputField = document.getElementById('distance' + i);
				if (inputField instanceof HTMLInputElement) {
					salivaDistances[i] = +inputField.value;
				}
			}
		}
		qrCodeProps.update((props) => {
			return {
				...props,
				salivaDistances: salivaDistances
			};
		});
	};
</script>

{#if $studyProps.studyType == CAR_STUDY || $studyProps.studyType == OTHER_STUDY}
	<Step locked={!$qrCodePropsValid}>
		<svelte:fragment slot="header">Qr Code Details</svelte:fragment>
		<form id="qr_code_form">
			<label class="label">
				<input class="checkbox" type="checkbox" bind:checked={$qrCodeProps.generateQrCodes} />
				Generate QR codes for {$studyProps.studyName}
			</label>
			{#if $qrCodeProps.generateQrCodes}
				<label class="label md:w-1/3">
					<span>Contact Email</span>
					<input class="input" id="mail" type="email" bind:value={$qrCodeProps.contact} required />
				</label>

				<div class="space-y-2">
					<label class="flex items-center space-x-2">
						<input class="checkbox" type="checkbox" bind:checked={$qrCodeProps.checkDuplicates} />
						<p>Check for Duplicates</p>
					</label>
					<label class="flex items-center space-x-2">
						<input class="checkbox" type="checkbox" bind:checked={$qrCodeProps.enableManualScan} />
						<p>Enable Manual Scanning Mode</p>
					</label>
					<label class="flex items-center space-x-2">
						<input class="checkbox" type="checkbox" bind:checked={uniformSalivaDistances} />
						<p>Equal Distances between biomarker samples</p>
					</label>
				</div>

				{#if uniformSalivaDistances}
					<label class="label">
						<span>Distance between saliva samples</span>
						<input
							class="input"
							id="distances"
							type="number"
							bind:value={salivaDistance}
							min="1"
							max="99"
							step="1"
							required
						/>
					</label>
				{/if}

				{#if !uniformSalivaDistances}
					<h4>Distance between biomarker samples</h4>
					<div
						class="h-full max-h-72 md:w-1/4 overflow-y-auto overflow-x-hidden flex flex-col flex-grow px-4"
					>
						<label class="label">
							{#each salivaDistances as dist, i}
								{#if $studyProps.startSampleFromZero}
									<p>{$studyProps.samplePrefix}{i} and {$studyProps.samplePrefix}{i + 1}:</p>
								{:else}
									<p>{$studyProps.samplePrefix}{i + 1} and {$studyProps.samplePrefix}{i + 2}:</p>
								{/if}
								{#if i == salivaDistances.length - 1}
                					<!-- last field: validate without the need to change focus -->
									<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
										<input
											class="input col-span-2"
											id="distance{i}"
											type="number"
											value={dist}
											on:input={salivaListChanged}
											min="1"
											max="999"
											step="1"
											required
										/>
										<div class="input-group-shim col-span-1">min</div>
									</div>
								{:else}
                					<!-- only validate after full number was entered -->
									<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
										<input
											class="input col-span-2"
											id="distance{i}"
											type="number"
											value={dist}
											on:focusout={salivaListChanged}
											min="1"
											max="999"
											step="1"
											required
										/>
										<div class="input-group-shim col-span-1">min</div>
									</div>
								{/if}
							{/each}
						</label>
					</div>
				{/if}
			{/if}
		</form>
	</Step>
{/if}
