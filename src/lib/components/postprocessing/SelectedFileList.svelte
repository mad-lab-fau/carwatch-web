<script lang="ts">
    export let files: FileList = <FileList>{};
</script>

<section class="w-full text-token card p-4 space-y-4">
    {#if files.length > 0}
        <p class="font-bold">Selected files</p>
            <ul class="list">
                {#each { length: files.length } as _, i}
                    <li>
                        <span class="badge-icon p-4 variant-soft-tertiary">
                        <span class="material-symbols-outlined"> contact_page </span>
                        </span>
                        <span class="flex-auto">{files[i].name}</span>
                    </li>
                {/each}
            </ul>
    {:else}
        <p class="font-bold text-center">No files selected.</p>
    {/if}
</section>