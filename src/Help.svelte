<script>
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';
    import { onStart } from './Demo/demo shared.svelte';
    import Demo from './Demo/Demo.svelte';
    import { ds } from './state.svelte';
    import { post, tapOrClick } from './utils';

    const tap = tapOrClick({ on: true });
    const hi = '<span style=\'color: var(--gold);\'>';
    const intro = '<span>Twist and turn the grid to make each row total the sum at the center. Solve the puzzle in as few steps as possible.</span>';

    const prompts = [
        `<span>${tap} the ${hi}rightmost</span> cell in a three-letter block to rotate it ${hi}clockwise</span>.`,
        `<span>${tap} the ${hi}leftmost</span> cell in a three-letter block to rotate it ${hi}counter-clockwise</span>.`,
        `<span>${tap} an ${hi}arrow</span> to rotate the ${hi}entire grid</span>.`,
        `<span>${tap} the ${hi}center cell</span> to ${hi}select a letter</span>.`,
        `<span>${tap} the ${hi}center cell</span> to ${hi}select a letter</span>.`,
        `<span>The words must read ${hi}from left to right</span>.`,
    ];

    onMount(() => {
        delete ds.cells;
        delete ds.started;

        onStart();
    });

    $effect(() => {
        const onTransitionEnd = (e) => {
            const id = e.target.id;

            if (id !== 'prompt') {
                return false;
            }

            if (e.propertyName !== 'transform') {
                return;
            }

            if (ds.step < 0) {
                const step = -ds.step + 1;

                if (step === prompts.length) {
                    post(() => onStart(true), 3000);
                } else {
                    ds.step = step;
                }
            }
        };

        window.addEventListener('transitionend', onTransitionEnd);
        return () => window.removeEventListener('transitionend', onTransitionEnd);
    });
</script>

<div class="help">
    <div class="content" tabindex="-1">
        {@html intro}
        <Demo />
        <div class="prompt-container">
            <div id="prompt" class="prompt {ds.step < 0 ? 'flipped' : ''}">
                {@html prompts[Math.abs(ds.step) - 1]}
            </div>
            {#if ds.over}
                <div class="prompt" transition:fade>
                    {@html prompts[prompts.length - 1]}
                </div>
            {/if}
        </div>
    </div>
</div>

<style>
    .help {
        grid-area: 2/1;
        justify-self: center;
        display: grid;
        border-radius: 20px;
        padding: 20px;
        box-sizing: border-box;
        font-family: 'Source Sans 3';
        font-size: 18px;
        background: #00000040;
        border: 2px solid var(--bronze);
        width: calc(min(90dvw, 340px));
        max-height: 470px;
        color: var(--bronze);
    }

    .content {
        display: grid;
        align-content: start;
        gap: 10px;
    }

    .prompt-container {
        display: grid;
    }

    .prompt {
        grid-area: 1/1;
        height: 70px;
        display: grid;
        place-content: center;
        transition:
            transform 0.2s linear,
            opacity 1s linear;
    }

    .flipped {
        transform: rotateX(90deg);
    }
</style>
