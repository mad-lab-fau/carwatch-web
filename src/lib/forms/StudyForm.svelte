<script lang="ts">
    import { studyProps, studyPropsValid } from '$lib/configStore';
    import { CAR_STUDY, LAB_STUDY, OTHER_STUDY } from '$lib/constants';
	  import { Step } from '@skeletonlabs/skeleton';
	  import { get } from 'svelte/store';
	  import { onMount } from 'svelte';

    onMount(() => {
      studyPropsValid.set(isValid());
    });

    // every time the store value changes, check if input is valid
    $: $studyProps, studyPropsValid.set(isValid());

    function isValid(){
        let idList = ["study_name", "num_days", "num_samples", "pref_bio", "num_subj", "prefix_subj"]
        for(let id of idList) {
          let element = document.getElementById(id);
          if(element instanceof HTMLInputElement){
            if(!(element.reportValidity())){
              return false;
            }
          }
        }
        return true;
    }    

    export const submitStudyProps = () => {
        let subjectList = createSubjectList();
        studyProps.update((props) => {
            return {
                ...props,
                subjectList: subjectList,
            };
          });
    }
    
    function createSubjectList(){
      // TODO handle subject path
        let subjectList = [];
        for (let i = 1; i <= get(studyProps).numSubjects; i++){
            subjectList.push(get(studyProps).subjectPrefix + i.toString().padStart(3, '0'));
        }
        return subjectList;
    }

</script>

<Step locked={!$studyPropsValid} type=submit on:next={submitStudyProps}>
  <svelte:fragment slot="header">Study Details</svelte:fragment>

  <form id="study_form">
    
    <div class="flex">
      <div class="w-1/3">
      <label class="label">
        <span>Study Name</span>
        <input class="input" id="study_name" type="text" bind:value={$studyProps.studyName} maxlength="15" required>
      </label>
    </div>

    <div class="w-1/3 mx-6">
      <label class="label">
        <span>Number of Days</span>
        <input class="input" id="num_days" type="number" bind:value={$studyProps.numDays} min="1" max ="99" step="1" required>
      </label>
    </div>

    <div class="w-1/3">  
      <label class="label">
        <span>Number of Biomarker Samples</span>
        <input class="input" id="num_samples" type="number" bind:value={$studyProps.numSamples} min="1" max ="99" step="1" required>
      </label>
    </div>
  </div>

      <label class="label">
        <span>Prefix of Biomarker</span>
        <input class="input" id="prefix_bio" type="text" maxlength="1" bind:value={$studyProps.samplePrefix} required>
      </label>

      <!-- <label class="label">
          <span>Read Subjects from File</span>
          <input class="input" id="from_file" type="checkbox" bind:checked={$studyProps.readSubjectsFromFile}>
      </label> -->
    
      {#if !$studyProps.readSubjectsFromFile}
      <label class="label">
        <span>Number of Subjects</span>
        <input class="input" id="num_subj" disabled={$studyProps.readSubjectsFromFile} type="number" min="1" max="999" step="1" bind:value={$studyProps.numSubjects} required={!$studyProps.readSubjectsFromFile}>
      </label>
      
      <label class="label">
        <span>Subject Prefix</span>
        <input class="input" id="pref_subj" disabled={$studyProps.readSubjectsFromFile} type="text" maxlength="5" bind:value={$studyProps.subjectPrefix}>
      </label>
      {/if}
    
      <!-- {#if $studyProps.readSubjectsFromFile}
      <label class="label">
        <span>Subject Path</span>
        <input class="input" id="subj_path" disabled={!$studyProps.readSubjectsFromFile} type="text" bind:value={subjectPath}>
      </label>
    
      <label class="label">
        <span>Subject Column</span>
        <input class="input" id="subj_col" disabled={!$studyProps.readSubjectsFromFile} type="text" bind:value={$studyProps.subjectColumn}>
      </label>
      {/if} -->
   
      <div class="row">
      <label class="label">
          <span>Study Type</span>
          <br>
      <select class="select" name="studyType" bind:value={$studyProps.studyType}>
          <option value={CAR_STUDY}>CAR Study</option>
          <option value={LAB_STUDY}>Lab-based study</option>
          <option value={OTHER_STUDY}>Other</option>
      </select>
      </label>
      </div>
      
      <div class="space-y-2">
        <label class="flex items-center space-x-2">
          <input class="checkbox" id="has_evening" type="checkbox" bind:checked={$studyProps.hasEveningSample}>
          <p>Has Evening Sample</p>
        </label>
      
        <label class="flex items-center space-x-2">
          <input class="checkbox" id="from_zero" type="checkbox" bind:checked={$studyProps.startSampleFromZero}>
          <p>Start Sample from Zero</p>
        </label>
      </div>
  </form>

</Step>