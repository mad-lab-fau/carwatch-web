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
            });  
        });
        mounted = true;
    });
</script>


{#if !mounted}
    <p>loading...</p>
{/if}


<body>
    <div class="grid-container">
    {#each $barcodeDataArray as _, i}
        <div class="grid-item">
        <svg class=barcode id="barcode{i}"></svg>
        <p>{$captionArray[i]}</p>
        </div>
    {/each}
</div>
</body>
<style>

    
.grid-container {
        display: grid;
        column-gap: 50px;
        row-gap: 50px;
        grid-template-columns: 50mm auto auto auto;
    }
</style>