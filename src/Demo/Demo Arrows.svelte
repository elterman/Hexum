<script>
    import { fade } from 'svelte/transition';
    import { DEX_DX } from '../const';
    import { ds } from '../state.svelte';

    const disabled = $derived(ds.twist || ds.over || ds.flip || ds.keyboard);

    const width = $derived(`${DEX_DX * 0.7}px`);
    const fsz = $derived(`${DEX_DX * 0.7}px`);
    const style = $derived(`width: ${width}; font-size: ${fsz};`);
</script>

{#if !ds.over && !ds.surrender}
    <div class={['arrows', { disabled }]} in:fade={{ delay: 1000 }} out:fade={{ duration: 150 }}>
        <div class="arrow no-highlight nw" {style}>⬇</div>
        <div class="arrow no-highlight ne" {style}>⬇</div>
        <div class="arrow no-highlight se" {style}>⬇</div>
        <div class="arrow no-highlight sw" {style}>⬇</div>
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

    .disabled {
        pointer-events: none;
        cursor: initial;
    }
</style>
