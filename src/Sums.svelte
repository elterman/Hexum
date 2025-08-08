<script>
    import NumberFlow from '@number-flow/svelte';
    import { HEX_DX } from './const';
    import { sumAt } from './shared.svelte';
    import { _prompt } from './state.svelte';

    const width = HEX_DX * 0.6;
</script>

<div class="sums {_prompt.id ? 'hidden' : ''}">
    {#each [1, 2, 3, 4, 5] as i (i)}
        {@const sum = sumAt(i)}
        <div
            class="sum no-highlight background-silver"
            style="width: {width}px; padding: {i === 3 ? '4px' : i === 1 || i === 5 ? 0 : '2px'}">
            <NumberFlow prefix={sum > 0 ? '+' : ''} value={sum} />
        </div>
    {/each}
</div>

<style>
    .sums {
        grid-area: 4/1;
        place-self: center;
        display: grid;
        grid-auto-flow: column;
        gap: 10px;
        border-radius: 50%;
        align-items: center;
        transition: opacity 0.2s;
    }

    .hidden {
        opacity: 0;
    }

    .sum {
        display: grid;
        place-content: center;
        aspect-ratio: 1;
        border-radius: 50%;
        transition: opacity 0.3s;
        font-family: Poppins;
        font-weight: bold;
        color: var(--backgrund);
    }
</style>
