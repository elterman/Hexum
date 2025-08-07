<script>
    import { fade } from 'svelte/transition';
    import { HEX_DY } from './const';
    import { ss } from './state.svelte';
    import { isSolved, onOver, persist } from './shared.svelte';
    import { _sound } from './sound.svelte';

    const onPointerDown = (ch) => {
        delete ss.keyboard;

        if (ss.center === ch) {
            return;
        }

        _sound.play('cluck');

        ss.center = ch;
        ss.steps += 1;

        if (isSolved()) {
            _sound.play('won', { rate: 4 });
            onOver();
        }

        persist();
    };
</script>

{#if ss.keyboard}
    <div class="keyboard" style="transform: translateY({56 + HEX_DY * 0.5}px);" transition:fade={{ duration: 200 }}>
        <div class="row">
            {#each 'ABCDEFGHI' as ch, i (i)}
                <div class="key no-highlight" onpointerdown={() => onPointerDown(ch)}>{ch}</div>
            {/each}
        </div>
        <div class="row">
            {#each 'JKLMNOPQR' as ch, i (i)}
                <div class="key no-highlight" onpointerdown={() => onPointerDown(ch)}>{ch}</div>
            {/each}
        </div>
        <div class="row">
            {#each 'STUVWXYZ' as ch, i (i)}
                <div class="key w no-highlight" onpointerdown={() => onPointerDown(ch)}>{ch}</div>
            {/each}
        </div>
    </div>
{/if}

<style>
    .keyboard {
        position: absolute;
        place-self: center;
        display: grid;
        font-family: Poppins;
        font-size: 16px;
        z-index: 1;
        gap: 4px;
        padding: 6px;
        border-radius: 5px;
        background: #ffff99;
    }

    .row {
        display: grid;
        grid-auto-flow: column;
        gap: 4px;
        justify-content: space-between;
    }

    .key {
        display: grid;
        place-content: center;
        background: var(--lightblue);
        background: #404040;
        color: white;
        font-weight: bold;
        height: 36px;
        cursor: pointer;
        border-radius: 4px;
        width: 35px;
    }

    .key:hover {
        background: black;
    }

    .w {
        width: 40px;
    }
</style>
