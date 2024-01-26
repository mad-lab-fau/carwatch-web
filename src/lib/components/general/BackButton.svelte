<script>
	import { base } from "$app/paths";

    export let parentRoute = "";
</script>

<a href="{base}/{parentRoute}" type="button" class="btn variant-filled-secondary mb-6 print:hidden ml-[10mm] mt-[10mm]">
    <span class="material-symbols-outlined">arrow_back</span>
    <span>Go Back</span>
</a>