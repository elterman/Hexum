<script>
    import NumberFlow from '@number-flow/svelte';
    import { fade } from 'svelte/transition';
    import { ss } from './state.svelte';

    const scoreReport = $derived.by(() => {
        if (!ss.over || ss.steps === 0) {
            return null;
        }

        const score = ss.score();
        return `  •  ${score === 0 ? 'even' : `${Math.abs(score)} ${score > 0 ? 'over' : 'under'}`} par`;
    });

</script>

<div class="steps">
    {#if ss.cheer}
        <div class="message" transition:fade>
            {ss.cheer}
        </div>
    {:else if !ss.surrender}
        <div id="steps" class="flow" transition:fade={{ duration: ss.surrender ? 0 : 400 }}>
            <NumberFlow value={ss.steps} />
            <span>{` step${ss.steps === 1 ? '' : 's'}`}</span>
            {#if scoreReport}
                <span>{scoreReport}</span>
            {/if}
        </div>
    {/if}
</div>

<style>
    .steps {
        grid-area: 2/1;
        display: grid;
        height: 40px;
        grid-auto-flow: column;
        font-family: Trajan;
        font-size: 22px;
        place-self: center;
        place-items: center;
        color: var(--bronze);
    }

    .message {
        grid-area: 1/1;
    }

    .flow {
        grid-area: 1/1;
        display: grid;
        grid-auto-flow: column;
        align-items: center;
    }
</style>
