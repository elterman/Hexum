<script>
    import { fade } from 'svelte/transition';
    import { HEX_DX } from './const';
    import { _sound } from './sound.svelte';
    import { _prompt, ss } from './state.svelte';
    import { onRotateGrid } from './shared.svelte';

    const onPointerDown = (cw) => {
        _prompt.opacity = 0;
        _sound.play('click');

        ss.twist = cw ? 'cw' : 'acw';
        ss.turns[0] += cw ? 1 : -1;
        ss.steps += 1;

        onRotateGrid(cw);
    };

    const disabled = $derived(ss.twist || ss.over || ss.cheer || ss.surrender || ss.flip || ss.keyboard);

    const width = $derived(`${HEX_DX * 0.7}px`);
    const fsz = $derived(`${HEX_DX * 0.7}px`);
    const style = $derived(`width: ${width}; font-size: ${fsz};`);
</script>

{#if !ss.over && !ss.surrender}
    <div class={['arrows', { disabled }]} in:fade={{ delay: 1000 }} out:fade={{ duration: 150 }}>
        <div class="arrow no-highlight nw" {style} onpointerdown={() => onPointerDown(false)}>⬇</div>
        <div class="arrow no-highlight ne" {style} onpointerdown={() => onPointerDown(true)}>⬇</div>
        <div class="arrow no-highlight se" {style} onpointerdown={() => onPointerDown(true)}>⬇</div>
        <div class="arrow no-highlight sw" {style} onpointerdown={() => onPointerDown(false)}>⬇</div>
    </div>
{/if}

<style>
    .arrows {
        grid-area: 3/1;
        display: grid;
        /* background: #ffffff40; */
    }

    .arrow {
        grid-area: 1/1;
        /* background: #ffffff40; */
        border-radius: 50%;
        color: var(--bronze);
        display: grid;
        place-content: center;
        cursor: pointer;
        opacity: 0.65;
    }

    .nw {
        place-self: start;
        transform: translate(-25%, 20%) rotate(30deg);
    }

    .ne {
        place-self: start end;
        transform: translate(25%, 20%) rotate(-30deg);
    }

    .sw {
        place-self: end start;
        transform: translate(-25%, -40%) rotate(-30deg);
    }

    .se {
        place-self: end;
        transform: translate(25%, -40%) rotate(30deg);
    }

    .arrow:hover {
        opacity: 1;
    }

    .disabled {
        pointer-events: none;
        cursor: initial;
    }
</style>
