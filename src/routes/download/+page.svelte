<script lang="ts">
	import { goto } from '$app/navigation';
	import { barcodeProps, qrCodeProps, studyProps } from '$lib/stores/configStore';
	import {
		FORBIDDEN_CHARACTERS,
		QR_PARSER_APP_ID,
		QR_PARSER_PROPERTY_CONTACT,
		QR_PARSER_PROPERTY_DUPLICATES,
		QR_PARSER_PROPERTY_EVENING,
		QR_PARSER_PROPERTY_MANUAL_SCAN,
		QR_PARSER_PROPERTY_NUM_PARTICIPANTS,
		QR_PARSER_PROPERTY_SALIVA_ALARMS,
		QR_PARSER_PROPERTY_SALIVA_TIMES,
		QR_PARSER_PROPERTY_START_SAMPLE,
		QR_PARSER_PROPERTY_STUDY_DAYS,
		QR_PARSER_PROPERTY_STUDY_NAME,
		QR_PARSER_SEPARATOR,
		QR_PARSER_SPECIFIER
	} from '$lib/constants';
	import { barcodeDataArray, captionArray, qrData } from '$lib/stores/dataStore';
	import BackButton from '$lib/components/general/BackButton.svelte';

	function downloadBarcodes() {
		createBarcodes();
		goto('download/barcodes');
	}

	function downloadQrCode() {
		createQrCodeData();
		goto('download/qrcode');
	}

	function createBarcodes() {
		let barcodeData = [];
		let captions = [];
		let startSample = $studyProps.startSampleFromZero ? 0 : 1;
		let studyName = $studyProps.studyName;
		for (let subject = 1; subject <= $studyProps.numSubjects; subject++) {
			for (let day = 1; day <= $studyProps.numDays; day++) {
				let lastSampleId = $studyProps.numSamples + startSample + Number($studyProps.hasEveningSample) - 1;
				for (let sample = startSample; sample <= lastSampleId; sample++) {
					// convert sample to zero padded string with length 2
					let sampleString = sample.toString().padStart(2, '0');
					let dayString = day.toString().padStart(2, '0');
					let subjectString = subject.toString().padStart(3, '0');
					let caption = '';
					if ($barcodeProps.addName) {
						caption += studyName + '_';
					}
					// special case: evening sample referred to a "A"
					let sampleCaption = sample.toString();
					if (sample == lastSampleId && $studyProps.hasEveningSample) {
						sampleCaption = 'E';
					}
					caption += $studyProps.subjectList[subject - 1] + '_D' + day + '_' + $studyProps.samplePrefix + sampleCaption;
					captions.push(caption);
					let data = subjectString + dayString + sampleString;
					barcodeData.push(data);
				}
			}
		}
		barcodeDataArray.set(barcodeData);
		captionArray.set(captions);
	}

	function createQrCodeData() {
		// sanitize inputs to prevent decoding issues
		let studyName = sanitizeStringForQr($studyProps.studyName);
		let distances = $qrCodeProps.salivaDistances.slice(0, $studyProps.numSamples - $qrCodeProps.numSampleAlarmTimes);
		let distanceList = distances.join(",");
		let fixedAlarms = $qrCodeProps.salivaAlarmTimes.slice(0, $qrCodeProps.numSampleAlarmTimes);
		let fixedAlarmList = fixedAlarms.join(",").replaceAll(":", "");
		let startSample = `${$studyProps.samplePrefix}${$studyProps.startSampleFromZero ? 0 : 1}`;

		// create encoding
		let qrDataString =
			`${QR_PARSER_APP_ID}${QR_PARSER_SEPARATOR}` +
			`${QR_PARSER_PROPERTY_STUDY_NAME}${QR_PARSER_SPECIFIER}${studyName}${QR_PARSER_SEPARATOR}` +
			`${QR_PARSER_PROPERTY_STUDY_DAYS}${QR_PARSER_SPECIFIER}${$studyProps.numDays}${QR_PARSER_SEPARATOR}` +
			`${QR_PARSER_PROPERTY_NUM_PARTICIPANTS}${QR_PARSER_SPECIFIER}${$studyProps.numSubjects}${QR_PARSER_SEPARATOR}` +
			`${QR_PARSER_PROPERTY_START_SAMPLE}${QR_PARSER_SPECIFIER}${startSample}${QR_PARSER_SEPARATOR}` +
			`${QR_PARSER_PROPERTY_SALIVA_TIMES}${QR_PARSER_SPECIFIER}${distanceList}${QR_PARSER_SEPARATOR}` +
			`${QR_PARSER_PROPERTY_SALIVA_ALARMS}${QR_PARSER_SPECIFIER}${fixedAlarmList}${QR_PARSER_SEPARATOR}` +
			`${QR_PARSER_PROPERTY_EVENING}${QR_PARSER_SPECIFIER}${+$studyProps.hasEveningSample}${QR_PARSER_SEPARATOR}` +
			`${QR_PARSER_PROPERTY_CONTACT}${QR_PARSER_SPECIFIER}${$qrCodeProps.contact}${QR_PARSER_SEPARATOR}` +
			`${QR_PARSER_PROPERTY_DUPLICATES}${QR_PARSER_SPECIFIER}${+$qrCodeProps.checkDuplicates}${QR_PARSER_SEPARATOR}` +
			`${QR_PARSER_PROPERTY_MANUAL_SCAN}${QR_PARSER_SPECIFIER}${+$qrCodeProps.enableManualScan}`;

		qrData.set(qrDataString);
	}

	function sanitizeStringForQr(input: string) {
		var sanitizedInput = input;
		FORBIDDEN_CHARACTERS.forEach((c) => {
			sanitizedInput = sanitizedInput.replace(new RegExp(c, 'g'), '');
		});
		return sanitizedInput;
	}
</script>

<BackButton parentRoute="preparation" />
<div class="px-10">
	<h1>Study Material</h1>
	{#if $barcodeProps.generateBarcodes}
		<div>
			<button on:click={downloadBarcodes} type="button" class="btn variant-filled-primary p-6 mt-6">
				<span class="material-symbols-outlined">barcode_scanner</span>
				<span>Get Printable Barcodes</span>
			</button>
		</div>
	{/if}
	{#if $qrCodeProps.generateQrCodes}
		<div>
			<button on:click={downloadQrCode} type="button" class="btn variant-filled-primary p-6 mt-6">
				<span class="material-symbols-outlined">qr_code_2</span>
				<span>Get Printable QR-Code</span>
			</button>
		</div>
	{/if}
	{#if !$barcodeProps.generateBarcodes && !$qrCodeProps.generateQrCodes}
		<br />
		<aside class="alert variant-filled-error w-fit">
			<span class="material-symbols-outlined"> warning </span>
			<div class="alert-message">
				<h3>No Material Generated!</h3>
				<p>Make sure you select materials to generate in your study configuration.</p>
			</div>
		</aside>
	{/if}
</div>
