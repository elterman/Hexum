<script>
    import Cell from './Cell.svelte';
    import { BLOCKS, BLUE, HEX_DX, HEX_DY, PINK } from './const';
    import { isSolved, onOver, persist } from './shared.svelte';
    import { _sound } from './sound.svelte';
    import { ss } from './state.svelte';

    const { bi } = $props();
    const block = BLOCKS[bi - 1];
    const id = $derived(`block-${bi}`);
    const up = bi % 2 === 0;
    const x = HEX_DX * (block.x || 0);
    const y = HEX_DY * (block.y || 0);
    const width = `${HEX_DX * 2}px`;
    const height = `${HEX_DY * 1.75}px`;
    const transform = $derived(`translate(${x}px, ${y}px) rotate(${ss.turns[bi] * 120}deg)`);
    const color = $derived(ss.turns[0] % 2 ? (up ? PINK : BLUE) : up ? BLUE : PINK);
    const duration = $derived(!ss.seenGamePage ? '0s' : ss.surrender ? '1s' : ss.twist ? '0.5s' : '0s');

    let style = $derived(
        `width: ${width}; height: ${height}; z-index: ${ss.twist === bi ? 1 : 0}; transform: ${transform}; transition-duration: ${duration};`,
    );

    $effect(() => {
        const onTransitionEnd = (e) => {
            if (e.target.id !== id) {
                return;
            }

            if (e.propertyName !== 'transform') {
                return;
            }

            if (ss.twist === bi) {
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
</script>

<div {id} class="block {up ? 'up' : ''} {ss.surrender ? 'surrender' : ''}" {style}>
    {#if ss.cells}
        <Cell --color={color} --place={`${up ? 'start center' : 'start'}`} home={block.positions[0]} {bi} />
        <Cell --color={color} --place={`${up ? 'end' : 'start end'}`} home={block.positions[1]} {bi} />
        <Cell --color={color} --place={`${up ? 'end start' : 'end center'}`} home={block.positions[2]} {bi} />
    {/if}
</div>

<style>
    .block {
        grid-area: 1/1;
        display: grid;
        transform-origin: 50% 42.88%;
        transition: transform 0.5s linear;
        pointer-events: none;
        /* background: #00000040; */
    }

    .up {
        transform-origin: 50% 57.14%;
    }

    .surrender {
        transition-delay: 0.5s;
    }
</style>
