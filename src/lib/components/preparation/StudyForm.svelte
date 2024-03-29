<script lang="ts">
    import { studyProps, studyPropsValid } from '$lib/stores/configStore';
    import { CAR_STUDY, LAB_STUDY, OTHER_STUDY } from '$lib/constants';
	  import { FileDropzone, Step, Toast, type ToastSettings } from '@skeletonlabs/skeleton';
	  import { onMount } from 'svelte';
    import Papa from 'papaparse';
    import { toastStore } from '@skeletonlabs/skeleton';
			

    onMount(() => {
      studyPropsValid.set(isValid());
    });

    let parsingError: string = "";

    // every time the store value changes, check if input is valid
    $: $studyProps, studyPropsValid.set(isValid());

    function isValid(){
      let permanentIdList = ["study_name", "num_days", "num_samples", "pref_bio"]
      let optionalIdList = ["num_subj"]
      if (!validateInputsFromList(permanentIdList)){
        return false;
      }
      // properties only visible and required if readSubjectsFromFile is false
      if(!$studyProps.readSubjectsFromFile){
        if (!validateInputsFromList(optionalIdList)){
          return false;
        }
      } else {
        if (!$studyProps.subjectList || $studyProps.subjectList.length == 0){
          return false;
        }
      }

      submitStudyProps();
      return true;
    }
    
    function validateInputsFromList(list: string[]){
      for(let id of list) {
          let element = document.getElementById(id);
          if(element instanceof HTMLInputElement){
            if(!(element.reportValidity())){
              return false;
            }
          }
        }
        return true;
    }
   
    function createSubjectList(){
      // called if subjects are not read from file
        let subjectList = [];
        let padding = 2;
        if ($studyProps.numSubjects > 99){
          padding = 3;
        }
        for (let i = 1; i <= $studyProps.numSubjects; i++){
            subjectList.push($studyProps.subjectPrefix + i.toString().padStart(padding, '0'));
        }
        return subjectList;
    }

    const submitStudyProps = () => {
      if (!$studyProps.readSubjectsFromFile){
        let subjectList = createSubjectList();
        // create numerically ordered list of subjects
        studyProps.update((props) => {
            return {
                ...props,
                subjectList: subjectList,
            };
          });
        } else {
          // ignore the entered number of subjects and use the number of subjects from the file
          studyProps.update((props) => {
            return {
                ...props,
                numSubjects: $studyProps.subjectList.length,
            };
          });
        }
    };

    function handleFileUpload(e: Event): void {
      // parse file content and set subject list to empty list in case of an error
      let el = document.getElementById('file');
      if (el instanceof HTMLInputElement) {
        if(el.files && el.files.length > 0) {
          let file: File = el.files[0];
          file.text().then((text) => {
            let delimiter = text.includes(";") || text.includes(",") ? "" : " ";
            parseFile(file, delimiter).then((subjectList) => {
              parsingError = "";
              studyProps.update((props) => {
                return {
                  ...props,
                  subjectList: subjectList,
                };
              });
            }).catch((err) => {
              parsingError = err;
              studyProps.update((props) => {
                return {
                  ...props,
                  subjectList: [],
                };
              });
            });
          });
        }
      }
    }

    function parseFile(file: File, delimiter: String): Promise<string[]>{
      let subjectList: string [] = [];
      let err: string = "";
      return new Promise<string[]>((resolve, reject) => {
        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          delimiter: delimiter,
          complete: function(parsed: any) {
            let col = $studyProps.subjectColumn;
            if (col){
              let result: string[] = [];
              for (const obj of parsed.data) {
                if (obj.hasOwnProperty(col)) {
                  result.push(obj[col]);
                } else {
                  err = "Column " + col + " not found in file.";
                  reject(err);
                }
              }
              subjectList = parsed.data.map((obj: any) => obj.subject);
            }
            if(parsed.errors.length > 0){
              err = parsed.errors[0].message;
              reject(err);
            } else {
              resolve(subjectList);
            }
          }
        });
      });
    }

    function sanitizeStudyName(e: KeyboardEvent) {
      // prevent underscore in study name
      if (e.key == "_") {
        e.preventDefault();
        const t: ToastSettings = {
          message: 'Symbol "' + e.key + '" not allowed in study name.',
          timeout: 4000
        };
        toastStore.trigger(t);
      }
    }
</script>
<Toast />
<Step locked={!$studyPropsValid}>
  <svelte:fragment slot="header">Study Details</svelte:fragment>

  <form id="study_form">
    
    <div class="flex">
      <div class="w-1/2">
        <label class="label">
          <span>Study name</span>
          <input class="input" id="study_name" type="text" on:keydown={sanitizeStudyName} bind:value={$studyProps.studyName} maxlength="15" required>
        </label>
      </div>
    </div>

    <hr class="my-4">
    
    <div class="flex">
      <div class="w-1/2">
        <label class="label">
          <span>Number of sampling days</span>
          <input class="input" id="num_days" type="number" bind:value={$studyProps.numDays} min="1" max ="99" step="1" required>
        </label>
      </div>
      <div class="w-1/2 mx-6">  
        <label class="label">
          <span>Number of biomarker samples per day</span>
          <input class="input" id="num_samples" type="number" bind:value={$studyProps.numSamples} min="1" max ="99" step="1" required>
        </label>
      </div>
      <div class="w-1/2 mx-6">  
        <label class="label">
          <span>Prefix for biomarker IDs (e.g. 'S' for saliva)</span>
          <input class="input" id="prefix_bio" type="text" maxlength="1" bind:value={$studyProps.samplePrefix} required>
        </label>
      </div>
    </div>

    <hr class="my-4">

    <div class="flex">
      <div class="w-1/2">  
        <div class="my-2">
          <label class="flex items-center space-x-2">
            <input class="checkbox" id="subjects_from_file" type="checkbox" bind:checked={$studyProps.readSubjectsFromFile}>
            <p>Read subject IDs from file</p>
          </label>
        </div> 
      </div>
    </div>
  
    {#if $studyProps.readSubjectsFromFile}
    <div class="flex">
      <div class="w-1/2">
        <label class="label">
          <span>Name of column with subject IDs</span>
          <input class="input" id="subj_col" type="text" bind:value={$studyProps.subjectColumn}>
        </label>
      </div>
      <div class="w-1/2 mx-6">
      </div>
    </div>

    <div class="flex">
      <div class="w-1/2">
        <div class="my-6">
          <FileDropzone name="file" id="file" on:change={handleFileUpload} accept=".csv">
            <svelte:fragment slot="message"><b>Upload a file</b> or drag and drop.</svelte:fragment>
            <svelte:fragment slot="meta">Expects a CSV-file with the participants names stored in the column specified as <i>subject column</i>.</svelte:fragment>
          </FileDropzone>
        </div>
      </div>
      
          {#if parsingError}
          <div class="w-1/2 mx-6 flex items-center">
            <aside class="alert variant-soft-error w-full">
              <span class="material-symbols-outlined">
              warning
              </span>
            <div class="alert-message">
                <h3>Error reading file!</h3>
                <p>{parsingError}</p>
            </div>
            </aside>
          </div>
          {:else}
          <div class="w-1/2 mx-6">
            <label class="label">
              <span>Current subject list</span>
              <textarea readonly class="textarea" rows="4" placeholder="No file specified yet.">{$studyProps.subjectList}</textarea>
            </label>
          </div>
          {/if}
      </div>
    {/if}

    {#if !$studyProps.readSubjectsFromFile}
    <div class="flex">
      <div class="w-1/2">  
        <label class="label">
          <span>Number of subjects</span>
          <input class="input" id="num_subj" disabled={$studyProps.readSubjectsFromFile} type="number" min="1" max="999" step="1" bind:value={$studyProps.numSubjects} required={!$studyProps.readSubjectsFromFile}>
        </label>
      </div>
      <div class="w-1/2 mx-6">  
        <label class="label">
          <span>Subject ID prefix (displayed on labels)</span>
          <input class="input" id="pref_subj" disabled={$studyProps.readSubjectsFromFile} type="text" maxlength="5" bind:value={$studyProps.subjectPrefix}>
        </label>
      </div>
    </div>
    {/if}    
    
    <hr class="my-4">

    <div class="space-y-2">
      <label class="flex items-center space-x-2">
        <input class="checkbox" id="has_evening" type="checkbox" bind:checked={$studyProps.hasEveningSample}>
        <p>Add additional evening sample (SE)</p>
      </label>
    
      <label class="flex items-center space-x-2">
        <input class="checkbox" id="from_zero" type="checkbox" bind:checked={$studyProps.startSampleFromZero}>
        <p>Start sample counter from zero (S0 instead of S1)</p>
      </label>
    </div>

    <hr class="my-4">

    <div class="w-fit">  
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
    </div>
  </form>

</Step>