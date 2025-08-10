<script>
    import { BLOCKS, BLUE, DEX_DX, DEX_DY, PINK } from '../const';
    import { ds } from '../state.svelte';
    import Cell from './Demo Cell.svelte';
    import { isSolved, onOver } from './demo shared.svelte';

    const { bi } = $props();
    const block = BLOCKS[bi - 1];
    const id = $derived(`demo-block-${bi}`);
    const up = bi % 2 === 0;
    const x = DEX_DX * (block.x || 0);
    const y = DEX_DY * (block.y || 0);
    const width = `${DEX_DX * 2}px`;
    const height = `${DEX_DY * 1.75}px`;
    const transform = $derived(`translate(${x}px, ${y}px) rotate(${ds.turns[bi] * 120}deg)`);
    const color = $derived(ds.turns[0] % 2 ? (up ? PINK : BLUE) : up ? BLUE : PINK);
    const duration = $derived(ds.twist ? '0.5s' : '0s');

    let style = $derived(
        `width: ${width}; height: ${height}; z-index: ${ds.twist === bi ? 1 : 0}; transform: ${transform}; transition-duration: ${duration};`,
    );

    $effect(() => {
        const onTransitionEnd = (e) => {
            if (e.target.id !== id) {
                return;
            }

            if (e.propertyName !== 'transform') {
                return;
            }

            if (ds.twist === bi) {
                delete ds.twist;
            }

            if (isSolved()) {
                onOver();
            }
        };

        window.addEventListener('transitionend', onTransitionEnd);
        return () => window.removeEventListener('transitionend', onTransitionEnd);
    });
</script>

<div {id} class="block {up ? 'up' : ''}" {style}>
    {#if ds.cells}
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
</style>
