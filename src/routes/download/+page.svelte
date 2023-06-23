<script lang="ts">
	import { goto } from "$app/navigation";
	import { barcodeProps, qrCodeProps, studyProps } from "$lib/configStore";
	import { barcodeDataArray, captionArray } from "$lib/dataStore";
  import { onMount } from 'svelte';

    function downloadBarcodes() {
      createBarcodes();
      goto("download/barcodes")
    }


    function createBarcodes() {
      console.log("creating barcodes for " + $studyProps.subjectList);
      let barcodeData = [];
      let captions = [];
      let startSample = $studyProps.startSampleFromZero ? 0 : 1;
      let studyName = $studyProps.studyName;
      for (let subject = 1; subject <= $studyProps.numSubjects; subject++) {
          for (let day = 1; day <= $studyProps.numDays; day++) {
              for (let sample = startSample; sample < $studyProps.numSamples + startSample; sample++) {
                  // convert sample to zero padded string with length 2
                  let sampleString = sample.toString().padStart(2, '0');
                  let dayString = day.toString().padStart(2, '0');
                  let subjectString = subject.toString().padStart(3, '0');
                  let caption = "";
                  if ($barcodeProps.addName) {
                      caption += studyName + "_";
                  }
                  // special case: evening sample referred to a "A"
                  let sampleCaption = sample.toString();
                  if (sample == $studyProps.numSamples && $studyProps.hasEveningSample){
                      sampleCaption = "E";
                  }
                  caption += $studyProps.subjectList[subject - 1] + "_D" + day + "_S" + sampleCaption;
                  captions.push(caption);
                  let data = subjectString + dayString + sampleString;
                  barcodeData.push(data);
              }
          }
    }

    barcodeDataArray.set(barcodeData);
    captionArray.set(captions);
}
    


</script>
    
<div class="p-6">
<h1>Study Material</h1>
{#if $barcodeProps.generateBarcodes}
<div>
<button on:click={downloadBarcodes} type="button" class="btn variant-filled-primary p-6 my-6">
  <span class="material-symbols-outlined">qr_code_2</span>
	<span>Get Printable Barcodes</span>
</button>
</div>
{/if}
{#if $qrCodeProps.generateQrCodes}
<div>
<button type="button" class="btn variant-filled-primary p-6">
  <span class="material-symbols-outlined">qr_code_2</span>
	<span>Get Printable QR-Code</span>
</button>
</div>
{/if}
{#if (!$barcodeProps.generateBarcodes && !$qrCodeProps.generateQrCodes)}
<br>
<aside class="alert variant-filled-error w-fit">
    <span class="material-symbols-outlined">
    warning
    </span>
  <div class="alert-message">
      <h3>No Material Generated!</h3>
      <p>Make sure you select materials to generate in your study configuration.</p>
  </div>
</aside>
{/if}
</div>
