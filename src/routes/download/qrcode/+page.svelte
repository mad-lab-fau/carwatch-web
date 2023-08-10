<script lang="ts">
	import { studyProps } from "$lib/configStore";
	import { QR_PER_PAGE } from "$lib/constants";
	import { qrData } from "$lib/dataStore";
	import { onMount } from "svelte";
    import QRCode from 'qrcode'; 
	import PrintInstruction from "$lib/components/PrintInstruction.svelte";
	import { base } from "$app/paths";

    onMount(async() => {
        Array.from(document.getElementsByClassName("qr-code")).forEach(canvas => {
            if (canvas instanceof HTMLCanvasElement){
                QRCode.toCanvas(canvas, $qrData, {scale:3}, function(error:any){
                    if (error) console.error(error);
                })
            }
        });
      });
    
    let numPages: number = Math.ceil($studyProps.numSubjects/QR_PER_PAGE);
</script>

<div class="h-full">
    
    <a href="{base}/download" type="button" class="btn variant-filled-secondary print:hidden ml-[10mm] mt-[10mm]">
        <span class="material-symbols-outlined">arrow_back</span>
        <span>Go Back</span>
    </a>

    <PrintInstruction fileType={"QR codes"}/>

    {#each Array(numPages) as _, page}
        <div class="page grid grid-cols-3 bg-white px" style:padding="20mm">
            {#each Array(QR_PER_PAGE) as _, i}
                <div class="label p-4 overflow-hidden" >
                    <canvas class="qr-code object-contain justify-center"/>
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
        width: 210mm;
        height: 297mm;
        /*distance between pages*/
        margin-left: 10mm;
        margin-top: 10mm;
        margin-bottom: 10mm;
        background: white;
        outline: 3px #000000 solid;
    }
   
    @page {
        size: A4;
        margin: 0;
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