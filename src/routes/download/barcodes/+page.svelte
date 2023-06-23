<script lang="ts">
	import { barcodeProps } from "$lib/configStore";
    import { barcodeDataArray, captionArray} from "$lib/dataStore";
    import JsBarcode from 'jsbarcode';
	import { onMount } from "svelte";
	import { tick } from "svelte";

    onMount(async() => {
        await tick();

        if($barcodeProps.hasBarcode){
            $barcodeDataArray.forEach((data, i) => {
                JsBarcode("#barcode" + i, data, {
                    format: "EAN8",
                    displayValue: true,
                    width: 3, 
                    height: 80, 
                    flat:true,
                    margin: 10
                });  
            }); 
        }
    });

    // page properties
    let colDist = $barcodeProps.colDist + "mm";
    let rowDist = $barcodeProps.rowDist + "mm";
    let paddingRight= $barcodeProps.rightMargin + "mm"; 
    let paddingLeft = $barcodeProps.leftMargin + "mm";
    let paddingTop = $barcodeProps.topMargin + "mm";
    let paddingBottom = $barcodeProps.bottomMargin + "mm";

    // label properties
    let cellsPerPage = $barcodeProps.numRows * $barcodeProps.numCols;
    let numBarcodes = $barcodeDataArray.length 
    let numPages: number = Math.ceil(numBarcodes / cellsPerPage);

</script>

    <div class="h-full overflow-y-auto overflow-x-auto">
    {#each Array(numPages) as _, page}
        <div class="page grid grid-cols-4 bg-white" style:gap={`${rowDist} ${colDist}`} style:padding-top={paddingTop} style:padding-bottom={paddingBottom} style:padding-left={paddingLeft} style:padding-right={paddingRight}>
            {#each Array(cellsPerPage) as _, i}
                {#if !(page*cellsPerPage + i >= numBarcodes)}
                <div class="label p-2 overflow-hidden" >
                    {#if $barcodeProps.hasBarcode}
                        <svg class="barcode" id="barcode{page*cellsPerPage + i}"></svg>
                        <p class="text-black px-2" style:bottom=0>{$captionArray[page*cellsPerPage + i]}</p>
                    {:else}
                        <p class="text-black px-2" style:top=0 style:font-size=small>{$captionArray[page*cellsPerPage + i]}</p>
                    {/if}

                </div>
                {:else}
                <!-- display empty labels to last page to preserve format -->
                <div class="label p-2 overflow-hidden">
                    <svg class="barcode"></svg>
                    <p class="text-black print:hidden"></p>
                </div>
                {/if}
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
            outline: 2px #000000 dotted;
        }

        .label svg {
            max-width: 100%;
            max-height: 90%;
        }
        .label p {
            max-width: 100%;
            max-height: 100%;
            position: relative;
            font-family: monospace, monospace;
            font-size: xx-small;
        }
     
        .page {
            /*A4 format*/
            width: 210mm;
            height: 297mm;
            /*distance between pages*/
            margin: 20mm;
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