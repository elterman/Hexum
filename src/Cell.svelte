<script>
    import { fade } from 'svelte/transition';
    import { HEX_DX, HEX_DY } from './const';
    import { decode, onRotateBlock } from './shared.svelte';
    import { _sound } from './sound.svelte';
    import { _prompt, ss } from './state.svelte';

    const { home, bi, color } = $props();
    const cell = $derived(ss.cells[home - 1]);
    const pos = $derived(cell.pos);
    const isCenter = home === 10;
    const evenRow = $derived((pos > 3 && pos < 8) || (pos > 12 && pos < 17));
    const id = $derived(`cell-${home}`);
    const fr = 0.95;
    const transform = $derived(`rotate(${ss.turns[0] * -60 + (isCenter ? 0 : ss.turns[bi] * -120)}deg)`);

    const side = $derived.by(() => {
        if (pos === 1 || pos === 6 || pos === 8 || pos === 11 || pos === 13 || pos === 18) {
            return -1;
        }

        if (pos === 2 || pos === 7 || pos === 9 || pos === 12 || pos === 14 || pos === 19) {
            return 1;
        }

        return 0;
    });

    const onPointerDown = () => {
        _prompt.opacity = 0;

        if (!side) {
            return;
        }

        _sound.play('click');

        ss.twist = bi;
        ss.turns[bi] += side;
        ss.steps += 1;

        onRotateBlock(bi, side > 0);
    };

    const disabled = $derived.by(() => {
        if (isCenter || !side || ss.twist || ss.over || ss.cheer || ss.surrender || ss.flip || ss.keyboard) {
            return true;
        }

        return false;
    });

    const classes = $derived(
        `hex ${ss.flip || ss.over || ss.cheer ? (evenRow ? 'aqua' : 'gold') : ''} ${disabled ? 'disabled' : ''} ${cell.blink ? 'blink' : ''} ${ss.over ? 'pulse' : ''}`,
    );

    const duration = $derived(!ss.seenGamePage ? '0s' : ss.surrender ? '1s' : ss.flip ? '0s' : '0.5s');

    const num = $derived(decode(cell.ch));
    const plus = $derived(num > 0 ? '+' : '');
</script>

<div {id} class="cell no-highlight" style="width: {HEX_DX}px; height: {HEX_DY}px;">
    <div
        class={classes}
        style="width: {HEX_DX * fr}px; height: {HEX_DY * fr}px; font-size: {HEX_DX * 0.35}px;"
        onpointerdown={onPointerDown}>
        {#if ss.cells}
            <div
                class="char {plus || num === 0 ? '' : 'negative'} {ss.surrender ? 'surrender' : ''}"
                style="transform: {transform}; transition-duration: {duration};"
                transition:fade>
                {plus + num}
            </div>
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
        transition: background-color 0.25s linear;
        display: grid;
        place-content: center;
        pointer-events: visible;
        cursor: pointer;
        place-items: center;
    }

    .hex:hover {
        filter: contrast(1.1) brightness(1.1);
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

    .surrender {
        transition-delay: 0.5s;
    }

    .blink {
        animation: pulse 0.2s alternate 4 ease-in-out;
    }

    .pulse {
        animation: pulse 0.2s alternate 6 ease-in-out;
    }

    @keyframes pulse {
        from {
            transform: scale(1);
        }
        to {
            transform: scale(0.85);
        }
    }

    .negative {
        color: #8a0000;
    }

    .gold {
        background: var(--gold);
    }

    .aqua {
        background: var(--aqua);
    }
</style>
