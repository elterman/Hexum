<script>
    import Block from './Block.svelte';
    import Cell from './Cell.svelte';
    import { GOLD, HEX_DX, HEX_DY } from './const';
    import { isSolved, makePuzzle, onOver, persist } from './shared.svelte';
    import { _sound } from './sound.svelte';
    import { ss } from './state.svelte';

    $effect(() => {
        const onTransitionEnd = (e) => {
            const id = e.target.id;

            if (id !== 'board' && id !== 'board-content') {
                return false;
            }

            if (e.propertyName !== 'transform') {
                return;
            }

            if (id === 'board-content' && ss.flip) {
                delete ss.flip;
                makePuzzle();
            } else if (id === 'board' && (ss.twist === 'cw' || ss.twist === 'acw')) {
                _sound.play('cluck');
                delete ss.twist;
            }

            if (isSolved()) {
                _sound.play('won', { rate: 4 });
                onOver();
            }

            persist();
        };

        window.addEventListener('transitionend', onTransitionEnd);
        return () => window.removeEventListener('transitionend', onTransitionEnd);
    });

    const transform = $derived(`rotate(${ss.turns[0] * 60}deg)`);
    const duration = $derived(!ss.seenGamePage ? '0s' : ss.surrender ? '1s' : ss.twist ? '0.5s' : '0s');

    const style = $derived(`width: ${HEX_DX * 5}px; height: ${HEX_DY * 4}px; transform: ${transform}; transition-duration: ${duration};`);
</script>

<div id="board" class="board {ss.surrender ? 'surrender' : ''}" {style}>
    <div id="board-content" class="content {ss.flip ? 'flipped' : ''}">
        {#each [1, 2, 3, 4, 5, 6] as i (i)}
            <Block bi={i} />
        {/each}
        {#if ss.cells}
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

    .surrender {
        transition-delay: 0.5s;
    }
</style>
