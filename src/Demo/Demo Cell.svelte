<script>
    import { fade } from 'svelte/transition';
    import { DEX_DX, DEX_DY } from '../const';
    import { ds } from '../state.svelte';

    const { home, bi } = $props();
    const cell = $derived(ds.cells[home - 1]);
    const pos = $derived(cell.pos);
    const center = home === 10;
    const evenRow = $derived((pos > 3 && pos < 8) || (pos > 12 && pos < 17));
    const id = $derived(`cell-${home}`);
    const fr = 0.95;
    const transform = $derived(`rotate(${ds.turns[0] * -60 + (center ? 0 : ds.turns[bi] * -120)}deg)`);

    const side = $derived.by(() => {
        if (pos === 1 || pos === 6 || pos === 8 || pos === 11 || pos === 13 || pos === 18) {
            return -1;
        }

        if (pos === 2 || pos === 7 || pos === 9 || pos === 12 || pos === 14 || pos === 19) {
            return 1;
        }

        return 0;
    });

    const disabled = $derived.by(() => {
        if ((!side && !center) || ds.twist || ds.over || ds.flip || ds.keyboard) {
            return true;
        }

        return false;
    });

    const classes = $derived(
        `hex ${disabled ? 'disabled' : ''} ${ds.flip ? 'over' : ''} ${ds.over ? 'pulse' : ''} ${(ds.over || ds.flip || ds.cheer) && evenRow ? 'even-row' : ''}`,
    );

    const duration = $derived(ds.flip || !ds.started ? '0s' : '0.5s');
</script>

<div {id} class="cell no-highlight" style="width: {DEX_DX}px; height: {DEX_DY}px;">
    <div class={classes} style="width: {DEX_DX * fr}px; height: {DEX_DY * fr}px; font-size: {DEX_DX * 0.45}px;">
        {#snippet char(pos)}
            <div
                class="char {pos === 'pos' ? 'pos' : pos === 'home' ? 'home' : ''}"
                style="transform: {transform}; transition-duration: {duration};"
                transition:fade>
                {pos === 'pos' ? cell.pos : pos === 'home' ? home : cell.ch}
            </div>
        {/snippet}
        {#if ds.cells && !center}
            {@render char()}
        {/if}
        {#if ds.debug}
            {@render char('home')}
            {@render char('pos')}
        {/if}
    </div>
</div>

<style>
    .cell {
        grid-area: 1/1;
        place-self: var(--place);
        display: grid;
        place-content: center;
        place-items: center;
    }

    .hex {
        grid-area: 1/1;
        clip-path: polygon(-50% 50%, 50% 100%, 150% 50%, 50% 0);
        background: var(--color);
        transition: background-color 0.1s linear;
        display: grid;
        place-content: center;
        pointer-events: visible;
        place-items: center;
    }

    .disabled {
        pointer-events: none;
        cursor: initial;
    }

    .char {
        grid-area: 1/1;
        font-family: Poppins;
        font-weight: bold;
        pointer-events: none;
        transition: transform 0.5s linear;
    }

    .home {
        margin: -40px 0 0;
        color: darkorchid;
    }

    .pos {
        margin: 0 0 -40px;
    }

    .pos,
    .home {
        font-family: Roboto Condensed;
        font-size: 12px;
    }

    .surrender {
        transition-delay: 0.5s;
    }

    .pulse {
        animation: pulse 0.2s alternate 6 ease-in-out;
    }

    .over,
    .pulse {
        background: #ffff99;
    }

    .even-row {
        background: #99df99;
    }

    @keyframes pulse {
        from {
            transform: scale(1);
        }
        to {
            transform: scale(0.85);
        }
    }
</style>
