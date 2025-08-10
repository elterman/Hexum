<script>
    import { DEX_DX, DEX_DY, GOLD } from '../const';
    import { ds } from '../state.svelte';
    import Block from './Demo Block.svelte';
    import Cell from './Demo Cell.svelte';
    import { isSolved, makePuzzle, onOver } from './demo shared.svelte';

    $effect(() => {
        const onTransitionEnd = (e) => {
            const id = e.target.id;

            if (id !== 'demo-board' && id !== 'demo-board-content') {
                return false;
            }

            if (e.propertyName !== 'transform') {
                return;
            }

            if (id === 'demo-board-content' && ds.flip) {
                delete ds.flip;
                makePuzzle();
            } else if (id === 'demo-board' && (ds.twist === 'cw' || ds.twist === 'acw')) {
                delete ds.twist;
            }

            if (isSolved()) {
                onOver();
            }
        };

        window.addEventListener('transitionend', onTransitionEnd);
        return () => window.removeEventListener('transitionend', onTransitionEnd);
    });

    const transform = $derived(`rotate(${ds.turns[0] * 60}deg)`);
    const duration = $derived(ds.twist ? '0.5s' : '0s');

    const style = $derived(`width: ${DEX_DX * 5}px; height: ${DEX_DY * 4}px; transform: ${transform}; transition-duration: ${duration};`);
</script>

<div id="demo-board" class="board" {style}>
    <div id="demo-board-content" class="content {ds.flip ? 'flipped' : ''}">
        {#each [1, 2, 3, 4, 5, 6] as i (i)}
            <Block bi={i} />
        {/each}
        {#if ds.cells}
            <Cell --color={GOLD} --place="center" home={10} />
        {/if}
    </div>
</div>

<style>
    .board {
        grid-area: 3/1;
        display: grid;
        justify-self: center;
        transition: linear transform 0.5s;
        /* background: #ffffff40; */
    }

    .content {
        grid-area: 1/1;
        display: grid;
        transition: linear transform 0.7s;
    }

    .flipped {
        transform: rotateZ(360deg) scale(0);
    }
</style>
