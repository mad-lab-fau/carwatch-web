<script lang="ts">
    import { studyProps } from '$lib/store';
    import { CAR_STUDY, LAB_STUDY, OTHER_STUDY } from '$lib/constants';
    const submit = () => {

        studyProps.update((props) => {
            return {
                ...props,
                studyName: props.studyName,
                numDays: props.numDays,
                numSamples: props.numSamples,
                numSubjects: props.numSubjects,
                subjectPath: props.subjectPath,
                subjectColumn: props.subjectColumn,
                subjectPrefix: props.subjectPrefix,
                hasEveningSample: props.hasEveningSample,
                startSampleFromZero: props.startSampleFromZero
        };
        });
    // redirect to home page
    //window.location.href = '/';

    // create grid
    }      

</script>

<form on:submit|preventDefault={submit}>
    <label>
      Study Name:
      <input type="text" bind:value={$studyProps.studyName} maxlength="15" required>
    </label>
  
    <label>
      Number of Days:
      <input type="number" bind:value={$studyProps.numDays} min="1" max ="99" step="1" required>
    </label>
  
    <label>
      Number of Biomarker Samples:
      <input type="number" bind:value={$studyProps.numSamples} min="1" max ="99" step="1" required>
    </label>

    <label>
        Prefix of Biomarker:
        <input type="text" bind:value={$studyProps.samplePrefix} required>
    </label>

    <label>
        Read Subjects from File:
        <input type="checkbox" bind:checked={$studyProps.readSubjectsFromFile}>
    </label>
  
    {#if !$studyProps.readSubjectsFromFile}
    <label>
      Number of Subjects:
      <input disabled={$studyProps.readSubjectsFromFile} type="number" min="1" max="999" step="1" bind:value={$studyProps.numSubjects}>
    </label>
    
    <label>
      Subject Prefix:
      <input disabled={$studyProps.readSubjectsFromFile} type="text" maxlength="5" bind:value={$studyProps.subjectPrefix}>
    </label>
    {/if}
  
    {#if $studyProps.readSubjectsFromFile}
    <label>
      Subject Path:
      <input disabled={!$studyProps.readSubjectsFromFile} type="text" bind:value={$studyProps.subjectPath}>
    </label>
  
    <label>
      Subject Column:
      <input disabled={!$studyProps.readSubjectsFromFile} type="text" bind:value={$studyProps.subjectColumn}>
    </label>
    {/if}
  
    <label>
      Has Evening Sample:
      <input type="checkbox" bind:checked={$studyProps.hasEveningSample}>
    </label>
  
    <label>
      Start Sample from Zero:
      <input type="checkbox" bind:checked={$studyProps.startSampleFromZero}>
    </label>

    <div class="row">
    <label>
        Study Type:
    <select name="studyType" size="1" bind:value={$studyProps.studyType} class="select" style="width: min-content">
        <option value={CAR_STUDY}>CAR Study</option>
        <option value={LAB_STUDY}>Lab-based study</option>
        <option value={OTHER_STUDY}>Other</option>
    </select>
    </label>
    </div>
    
    <button type="submit" class="btn variant-filled">Create Study</button>

</form>