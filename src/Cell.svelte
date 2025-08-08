<script>
    import { fade } from 'svelte/transition';
    import { HEX_DX, HEX_DY } from './const';
    import { decode, onRotateBlock } from './shared.svelte';
    import { _sound } from './sound.svelte';
    import { _prompt, ss } from './state.svelte';
    import { post } from './utils';

    const { home, bi } = $props();
    const cell = $derived(ss.cells[home - 1]);
    const pos = $derived(cell.pos);
    const center = home === 10;
    const evenRow = $derived((pos > 3 && pos < 8) || (pos > 12 && pos < 17));
    const id = $derived(`cell-${home}`);
    const fr = 0.95;
    const transform = $derived(`rotate(${ss.turns[0] * -60 + (center ? 0 : ss.turns[bi] * -120)}deg)`);

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

        if (center) {
            _sound.play('plop');
            post(() => (ss.keyboard = true));
            return;
        }

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
        if ((!side && !center) || ss.twist || ss.over || ss.cheer || ss.surrender || ss.flip || ss.keyboard) {
            return true;
        }

        return false;
    });

    const classes = $derived(
        `hex ${disabled ? 'disabled' : ''} ${ss.flip || ss.cheer ? 'over' : ''} ${ss.over ? 'pulse' : ''} ${(ss.over || ss.flip || ss.cheer) && evenRow ? 'even-row' : ''}`,
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
        {#snippet char(pos)}
            <div
                class="char {plus || num === 0 ? '' : 'negative'} {ss.surrender ? 'surrender' : ''} {pos === 'pos' ? 'pos' : pos === 'home' ? 'home' : ''}"
                style="transform: {transform}; transition-duration: {duration};"
                transition:fade>
                {pos === 'pos' ? cell.pos : pos === 'home' ? home : plus + num}
            </div>
        {/snippet}
        {#if ss.cells && !center}
            {@render char()}
        {/if}
        {#if ss.debug}
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
        background: #eedc93;
    }

    .even-row {
        background: #93eeae;
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
</style>
