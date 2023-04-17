<script lang="ts">
	import { studyProps } from "$lib/store";
	import BarcodeForm from "./BarcodeForm.svelte";
	import StudyForm from "./StudyForm.svelte";

    

</script>

 <h1>The study name is {$studyProps.studyName}</h1>
 <br>
 <StudyForm/>
 <BarcodeForm/>

  
  



