<script>
    import { fade } from 'svelte/transition';
    import { DEX_DY } from '../const';
    import { ds } from '../state.svelte';
</script>

{#if ds.keyboard}
    <div class="keyboard" style="transform: scale(0.8) translateY({56 + DEX_DY * 0.5}px);" transition:fade={{ duration: 200 }}>
        <div class="row">
            {#each 'ABCDEFGHI' as ch, i (i)}
                <div class="key no-highlight">{ch}</div>
            {/each}
        </div>
        <div class="row">
            {#each 'JKLMNOPQR' as ch, i (i)}
                <div class="key no-highlight">{ch}</div>
            {/each}
        </div>
        <div class="row">
            {#each 'STUVWXYZ' as ch, i (i)}
                <div class="key w no-highlight">{ch}</div>
            {/each}
        </div>
    </div>
{/if}

<style>
    .keyboard {
        position: absolute;
        place-self: center;
        display: grid;
        font-family: Poppins;
        font-size: 16px;
        z-index: 1;
        gap: 4px;
        padding: 6px;
        border-radius: 5px;
        background: #ffff99;
    }

    .row {
        display: grid;
        grid-auto-flow: column;
        gap: 4px;
        justify-content: space-between;
    }

    .key {
        display: grid;
        place-content: center;
        background: var(--lightblue);
        background: #404040;
        color: white;
        font-weight: bold;
        height: 36px;
        border-radius: 4px;
        width: 35px;
    }

    .w {
        width: 40px;
    }
</style>
