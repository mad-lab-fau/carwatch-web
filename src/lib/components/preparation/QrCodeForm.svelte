<script lang="ts">
	import { CAR_STUDY, DEFAULT_SALIVA_DISTANCE, DEFAULT_SALIVA_TIME, OTHER_STUDY } from '$lib/constants';
	import { studyProps, qrCodeProps, qrCodePropsValid } from '$lib/stores/configStore';
	import { Step, RadioGroup, RadioItem } from '@skeletonlabs/skeleton';
	import { onMount, afterUpdate } from 'svelte';
	import type { SampleTime } from '$lib/stores/configStore';

	let uniformSalivaDistances = true;
	let salivaDistance = DEFAULT_SALIVA_DISTANCE;
	let salivaTimes: SampleTime[];

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
		if (!$qrCodeProps.salivaTimes || $qrCodeProps.salivaTimes.length != $studyProps.numSamples) {
			salivaTimes = [...Array(Math.floor(Number($studyProps.numSamples)))].map(_ => Object.assign({}, DEFAULT_SALIVA_TIME));
			// use values from storage
		} else {
			salivaTimes = $qrCodeProps.salivaTimes;
		}
	}

	function isValid() {
		let idList = ['mail'];
		if (uniformSalivaDistances) {
			idList = [...idList, 'distances'];
		} else {
			for (let i = 0; i < salivaTimes.length; i++) {
				idList = [...idList, 'timeValue' + i];
			}
		}
		for (let id of idList) {
			let element = document.getElementById(id);
			if (element instanceof HTMLInputElement && !element.reportValidity()) {
				return false;
			}
		}
		if (salivaTimes){
			submitQrCodeProps();
		}
		return true;
	}

	function salivaListChanged() {
		qrCodePropsValid.set(isValid());
	}

	const submitQrCodeProps = () => {
		if (uniformSalivaDistances) {
			salivaTimes = salivaTimes.fill({isRelative: true, value: salivaDistance.toString()})
		} else {
			for (let i = 0; i < salivaTimes.length; i++) {
				let inputField = document.getElementById('timeValue' + i);
				if (inputField instanceof HTMLInputElement) {
					salivaTimes[i].value = (+inputField.value).toString();
				}
			}
		}
		qrCodeProps.update((props) => {
			return {
				...props,
				salivaTimes: salivaTimes
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

				{#if $studyProps.numSamples > 1}
				<p><b>Time between biomarker samples</b></p>
					{#if uniformSalivaDistances}
					<div
					class="h-full max-h-72 md:w-1/4 overflow-y-auto overflow-x-hidden flex flex-col flex-grow px-4"
					>
					<label class="label">
								<p><b>All samples</b></p>
								<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
									<input
										class="input col-span-2"
										id="distances"
										type="number"
										bind:value={salivaDistance}
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
							{#each salivaTimes as sampleTime, i}
								<fieldset>
									<legend>
										<p>Sample {i + 1}</p>
									</legend>
									<div class="flex space-x-4">
										<div class="h-full">
											<RadioGroup class="align-middle">
												<RadioItem bind:group={sampleTime.isRelative} name="justify" value={true}>rel</RadioItem>
												<RadioItem bind:group={sampleTime.isRelative} name="justify" value={false}>abs</RadioItem>
											</RadioGroup>
										</div>
										<div class="input-group input-group-divider grid-cols-[auto_2fr_auto] flex">
											<label for="timeValue{i}" class="hidden">Time</label>
											{#if sampleTime.isRelative}
												<input
													class="input col-span-2"
													id="timeValue{i}"
													type="number"
													bind:value={sampleTime.value}
													on:input={salivaListChanged}
													min="1"
													max="999"
													step="1"
													required/>
												<div class="input-group-shim col-span-1">min</div>
											{:else}
												<input
													class="input col-span-2"
													id="timeValue{i}"
													type="time"
													bind:value={sampleTime.value}
													on:input={salivaListChanged}/>
											{/if}
										</div>
									</div>
								</fieldset>
								<div></div>
							{/each}
						</div>
					{/if}
				{/if}
			{/if}
		</form>
	</Step>
{/if}