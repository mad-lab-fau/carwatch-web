<script lang="ts">
    import { barcodeDataArray, captionArray} from "$lib/dataStore";
    import JsBarcode from 'jsbarcode';
	import { onMount } from "svelte";
	import { tick } from "svelte";
	import { get } from "svelte/store";

    // TODO why can't I refresh the page without internal server error?
    let mounted = false;
    onMount(async() => {
        await tick();
        //JsBarcode(".barcode").init();
        get(barcodeDataArray).forEach((data, i) => {
            JsBarcode("#barcode" + i, data, {
                format: "EAN8",
                displayValue: true,
                width: 3, 
                height: 80, 
                flat:true
            });  
        });
        mounted = true;
    });

    let gapSize: string
</script>


{#if !mounted}
    <p>loading...</p>
{/if}

<input type="text" bind:value={gapSize}>
    
    <div class="h-full overflow-y-auto overflow-x-auto">
        <div class="page grid grid-cols-4 bg-white" style:gap={`${gapSize}mm ${gapSize}mm`}>
            {#each $barcodeDataArray as _, i}
                {#if i<48}
                <div class="container p-2 border-2 border-red-500 overflow-hidden" >
                    <svg class="barcode" id="barcode{i}"></svg>
                    <p class="text-black">{$captionArray[i]}</p>
                </div>
                {/if}
            {/each}
        </div>
    
        <div>next</div>
    </div>

    
    <style>
        * {
            box-sizing: border-box;
            -moz-box-sizing: border-box;
            -webkit-box-sizing: border-box;
        }

        .container {
            position: relative;
            overflow: hidden;
            display: flex;
            justify-content: center;
        }

        .container svg {
            max-width: 100%;
            max-height: 90%;
        }
        .container p {
            max-width: 100%;
            max-height: 100%;
            position: absolute;
            float: bottom;
            bottom: 0;
            font-family: monospace, monospace;
            font-size: xx-small;
        }
     
        .page {
            /*A4 format*/
            width: 210mm;
            height: 297mm;
            /*distance between pages*/
            margin: 20mm;
            /*page margins*/
            padding-right: 7.3mm; /*true margin right - col dist*/
            padding-left: 9.8mm;
            padding-top: 21.2mm;
            padding-bottom: 21.2mm; /*true margin bottom - row dist*/
            background: white;
            outline: 3px #bb1010 solid;
        }
       
        @page {
            size: A4;
            margin: 0;
        }
        @media print {
            * {
                overflow: hidden !important;
            }
            .page {
                margin: 0;
                border: initial;
                border-radius: initial;
                min-height: initial;
                box-shadow: initial;
                background: initial;
            }
        }
    </style>
     



