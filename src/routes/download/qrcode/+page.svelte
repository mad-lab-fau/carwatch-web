<script lang="ts">
  import { qrCodeProps, studyProps } from "$lib/stores/configStore";
  import { qrDataArray } from "$lib/stores/dataStore";
	import { onMount } from "svelte";
  import { cssVariables } from "$lib/components/download/util";
  import QRCode from 'qrcode';
	import PrintInstruction from "$lib/components/download/PrintInstruction.svelte";
	import BackButton from "$lib/components/general/BackButton.svelte";

    onMount(async() => {
        Array.from(document.getElementsByClassName("qr-code")).forEach((canvas, i) => {
            if (canvas instanceof HTMLCanvasElement && i < $studyProps.numParticipants){
                QRCode.toCanvas(canvas, $qrDataArray[i], {scale:3}, function(error:any){
                    if (error) console.error(error);
                })
            }
        });
      });

    let width = $qrCodeProps.useLetterFormat ? "8.5in" : "210mm";
    let height = $qrCodeProps.useLetterFormat ? "11in" : "297mm";
    let qrPerPage: number = $qrCodeProps.numColumns * $qrCodeProps.numRows;
    let numPages: number = Math.ceil($studyProps.numParticipants/qrPerPage);
    let cssFile = $qrCodeProps.useLetterFormat ? "../print_letter.css" : "../print_a4.css";
    import(cssFile);
</script>

<div class="h-full">
    <BackButton parentRoute="download" />
    <PrintInstruction fileType={"QR codes"}/>

    {#each Array(numPages) as _, page}
        <div use:cssVariables={{width, height}} class="page grid grid-cols-{$qrCodeProps.numColumns} bg-white px" style:padding="20mm">
            {#each Array(qrPerPage) as _, i}
                <div class="label p-4 overflow-hidden" >
                    <canvas class="qr-code object-contain justify-center"/>
                    {#if $qrCodeProps.includeParticipantId && page * qrPerPage + i < $studyProps.numParticipants}
                        <p class="absolute text-black px-2 pt-135">{$studyProps.participantList[page * qrPerPage + i]}</p>
                    {/if}
                </div>
            {/each}
        </div>
    {/each}
</div>

<style>
    * {
        box-sizing: border-box;
        -moz-box-sizing: border-box;
        -webkit-box-sizing: border-box;
    }

    .label {
        position: relative;
        overflow: hidden;
        display: flex;
        justify-content: center;
    }

    .page {
        /*A4 format*/
        width: var(--width);
        height: var(--height);
        /*distance between pages*/
        margin-left: 10mm;
        margin-top: 10mm;
        margin-bottom: 10mm;
        background: white;
        outline: 3px #000000 solid;
    }
   
    @media print {
        * {
            overflow: visible !important;
        }
        .label {
            outline: none;
        }
        .page {
            margin: 0;
            border: initial;
            border-radius: initial;
            min-height: initial;
            box-shadow: initial;
            background: initial;
            outline: none;
        }
    }
</style>