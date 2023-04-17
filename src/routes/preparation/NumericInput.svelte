<script lang="ts">
    export let labelName = "";
    export let value = 0;
    export let isRequired = false;
    export let isInt = false;
</script>

{#if {isRequired}&&{isInt}}
<label>
    {labelName}
    <input type="number" bind:value min="1" step="1" required>
</label> 
{/if}
    
{#if {isRequired}&&!{isInt}}
<label>
    {labelName}
    <input type="number" bind:value required>
</label>
{/if}
    
{#if !{isRequired}&&{isInt}}
<label>
    {labelName}
    <input type="number" bind:value min="1" step="1">
</label>
{/if}
    
{#if !{isRequired}&&!{isInt}}
<label>
    {labelName}
    <input type="number" bind:value>
</label>
{/if}
