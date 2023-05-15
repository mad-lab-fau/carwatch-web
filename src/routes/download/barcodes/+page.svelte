<script lang="ts">
</script>

<style>
    * {
        box-sizing: border-box;
        -moz-box-sizing: border-box;
        -webkit-box-sizing: border-box;
    }
    .page {
        /*A4 format*/
        width: 210mm;
        min-height: 297mm;
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
    /*
    .subpage { 
        padding: 1cm;
        border: 5px red solid;
        height: 257mm;
        outline: 2cm #FFEAEA solid;
    }*/
    .label {
            /*padding of label content*/
            padding: 2mm;
            margin-right: 2.5mm;
            margin-left: 0mm;
            margin-bottom: 0mm;
            margin-top: 0mm;
            /* height = (a4_height - top_margin - bottom_margin - inter_row * num_rows) / num_rows */
            /* width = (a4_width - left_margin - right_margin - inter_col * num_cols) / num_cols */
            width: 44.725mm; /*45.725 why doesnt it fit??*/
            height: 21.2166mm;
            display: inline-block;
            text-align: left;
            background: #FFFFFF;
            outline: 2px dotted #000000;
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
    <div class="h-full overflow-y-auto overflow-x-auto">
        <div class="page">
            <div class="label">
                test
            </div>
            <div class="label">
                test
            </div>
            <div class="label">
                test
            </div>
            <div class="label">
                test
            </div>
            <div class="label">
                test
            </div>
            <div class="label">
                test
            </div>
            <div class="label">
                test
            </div>
            <div class="label">
                test
            </div>
            <div class="label">
                test
            </div>
            <div class="label">
                test
            </div>
            <div class="label">
                test
            </div>
            <div class="label">
                test
            </div>
            <div class="label">
                test
            </div>
            <div class="label">
                test
            </div>
            <div class="label">
                test
            </div>
            <div class="label">
                test
            </div>
            <div class="label">
                test
            </div>
            <div class="label">
                test
            </div>
            <div class="label">
                test
            </div>
            <div class="label">
                test
            </div>
            <div class="label">
                test
            </div>
            <div class="label">
                test
            </div>
            <div class="label">
                test
            </div>
            <div class="label">
                test
            </div>
            <div class="label">
                test
            </div>
            <div class="label">
                test
            </div>
            <div class="label">
                test
            </div>
            <div class="label">
                test
            </div>
            <div class="label">
                test
            </div>
            <div class="label">
                test
            </div>
            <div class="label">
                test
            </div>
            <div class="label">
                test
            </div>
            <div class="label">
                test
            </div>
            <div class="label">
                test
            </div>
            <div class="label">
                test
            </div>
            <div class="label">
                test
            </div>
            <div class="label">
                test
            </div>
            <div class="label">
                test
            </div>
            <div class="label">
                test
            </div>
            <div class="label">
                test
            </div>
            <div class="label">
                test
            </div>
            <div class="label">
                test
            </div>
            <div class="label">
                test
            </div>
            <div class="label">
                test
            </div>
            <div class="label">
                test
            </div>
            <div class="label">
                test
            </div>
            <div class="label">
                test
            </div>
            <div class="label">
                test
            </div>
        </div>
    
        <div>
            next
        </div>
    </div>

