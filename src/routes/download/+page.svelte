<script lang="ts">
	import { goto } from "$app/navigation";
    import {createBarcodes} from "$lib/barcodeLogic";
	import { barcodeProps, qrCodeProps } from "$lib/configStore";

    function downloadBarcodes() {
        /*
        const my_window = window.open(
          "",
          "mywindow",
          "status=1,width=210mm,height=297mm"
        );
        my_window.document.write("<html><head><title>Print Me</title></head>");
        my_window.document.write('<body onbeforeprint="self.close()">');
        my_window.document.write(
          "<p>When you print this window, it will close afterward.</p>"
        );
        my_window.document.write("</body></html>");
      }
      */
      createBarcodes();
      goto("download/barcodes")
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
