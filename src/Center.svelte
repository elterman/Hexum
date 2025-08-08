<script>
    import { fade } from 'svelte/transition';
    import { ss } from './state.svelte';
    import { HEX_DX } from './const';
</script>

{#if ss.cells}
    <div class="char" style="font-size: {HEX_DX * 0.35}px;" transition:fade={{ duration: 200 }}>{ss.sum}</div>
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
