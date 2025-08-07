<script>
    import { fade } from 'svelte/transition';
    import { DEX_DX } from '../const';
    import { ds } from '../state.svelte';
</script>

{#if ds.cells && ds.center}
    {#key ds.center}
        <div class="char" style="font-size: {DEX_DX * 0.45}px;" transition:fade={{ duration: 200 }}>{ds.center}</div>
    {/key}
{/if}

<style>
    .char {
        grid-area: 3/1;
        place-self: center;
        font-family: Poppins;
        font-weight: bold;
        pointer-events: none;
        z-index: 1;
    }
</style>
