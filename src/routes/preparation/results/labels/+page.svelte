<script lang="ts">
    import { barcodeDataArray, captionArray} from "$lib/dataStore";
    import JsBarcode from 'jsbarcode';
	import { onMount } from "svelte";
    onMount(() => {
        JsBarcode(".barcode").init();
    });
</script>
<body>
    <div class="grid">
        {#each $barcodeDataArray as item, i}
            <div>
            <svg class="barcode"
                jsbarcode-format="EAN8"
                jsbarcode-value={item}
                jsbarcode-textmargin="0"
                jsbarcode-height="30">
            </svg>
            <p>{$captionArray[i]}</p>
            </div>
        {/each}
    </div>
</body>

<style>
    .barcode {
    display: grid;
    grid-template-columns: repeat(1fr, 5) ;
    grid-template-rows: repeat(1fr, 5) ;
    grid-column-gap: 0px;
    grid-row-gap: 0px;
    }
    #each
</style>
