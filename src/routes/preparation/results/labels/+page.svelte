<script lang="ts">
	import Barcodes from "./Barcodes.svelte";
</script>

<style>
    * {
        box-sizing: border-box;
        -moz-box-sizing: border-box;
    }
    .page {
        width: 210mm;
        min-height: 297mm;
        padding: 20mm;
        margin: 10mm auto;
        border: 1px #D3D3D3 solid;
        border-radius: 5px;
        background: white;
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
    }
    .subpage {
        padding: 1cm;
        border: 5px red solid;
        height: 257mm;
        outline: 2cm #FFEAEA solid;
    }
    
    @page {
        size: A4;
        margin: 0;
    }
    @media print {
        * {
            overflow: visible !important;
        }
        .page {
            width: 210mm;
            height: 297mm; 
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
    <div class="overflow-visible">
        <div class="page">
            <div class="subpage">Page 1/2</div>    
        </div>
        <div class="page">
            <div class="subpage">Page 2/2</div>    
        </div>
    </div>

