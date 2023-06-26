<script lang="ts">
	import { studyProps } from "$lib/configStore";
	import { QR_PER_PAGE } from "$lib/constants";
    import { qr } from 'headless-qr';
	import { qrData } from "$lib/dataStore";
	import { onMount } from "svelte";


    let m: boolean[][]; 

    onMount(async() => {
        m = qr(qrData);

        console.log(m);

        const canvases = document.getElementsByClassName('qr');

        Array.from(canvases).forEach(canvas => {
            if(canvas instanceof HTMLCanvasElement){
            const ctx = canvas.getContext('2d');

                if(ctx){
                    const width = m[0].length;
                    const height = m.length;
                    console.log("width " + width + " height " + height);
                    canvas.width = width;
                    canvas.height = height;

                    for (let y = 0; y < height; y++) {
                        for (let x = 0; x < width; x++) {
                        const pixelColor = m[y][x] ? 'black' : 'white';
                        ctx.fillStyle = pixelColor;
                        ctx.fillRect(x, y, 1, 1);
                        }
                    }
            ctx.scale(5,5);
                }
            
            }
        });
    });
    
    let numPages: number = Math.ceil($studyProps.numSubjects/QR_PER_PAGE);
    let cellsPerPage = 20;
   
</script>

<div class="h-full overflow-y-auto overflow-x-auto">
    {#each Array(numPages) as _, page}
        <div class="page grid grid-cols-4 bg-white" style:gap="5mm 5mm" style:padding="20mm">
            {#each Array(cellsPerPage) as _, i}
                {#if !(page*cellsPerPage + i >= $studyProps.numSubjects)}
                <div class="label p-2 overflow-hidden" >
                    <div id="canvas-container">
                        <canvas class="qr"></canvas>
                    </div>
                </div>
                {:else}
                <!-- display empty labels to last page to preserve format -->
                <div class="label p-2 overflow-hidden">
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
        position: absolute;
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