<script lang="ts">
	import { studyProps } from "$lib/configStore";
	import { QR_PER_PAGE } from "$lib/constants";
	import { qrData } from "$lib/dataStore";
	import { onMount } from "svelte";
    import QRCode from 'qrcode'; 

    onMount(async() => {
        Array.from(document.getElementsByClassName("myqr")).forEach(canvas => {
            QRCode.toCanvas(canvas, $qrData,function(error:any){
                if (error) console.error(error);
            })
        });
      });
    
    let numPages: number = Math.ceil($studyProps.numSubjects/QR_PER_PAGE);
</script>

<div class="h-full overflow-y-auto overflow-x-auto">
    {#each Array(numPages) as _, page}
        <div class="page grid grid-cols-3 bg-white" style:padding="25mm">
            {#each Array(QR_PER_PAGE) as _, i}
                <div class="label p-4 overflow-hidden" >
                    <canvas class="myqr object-contain"/>
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
        display: flex;
        justify-content: center;
        outline: 2px #000000 dotted;
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