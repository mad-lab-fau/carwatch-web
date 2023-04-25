<script lang="ts">
	import { goto } from "$app/navigation";
    import {createBarcodes} from "$lib/barcodeLogic";

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
      goto("results/labels")
    }
    


</script>
    
<h1>You can access your prepared material here.</h1>
<button on:click={downloadBarcodes} type="button" class="btn variant-filled-primary">
	<span>(icon)</span>
	<span>Download Barcodes</span>
</button>
<button type="button" class="btn variant-filled-primary">
	<span>(icon)</span>
	<span>Download QR-Code</span>
</button>


<style>
/*@media print {

    page {
      margin: 0;
      color: #000;
      background-color: #fff;
    }
  
  }*/
</style>
