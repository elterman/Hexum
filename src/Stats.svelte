<script>
    import NumberFlow from '@number-flow/svelte';
    import { _stats } from './state.svelte';

    const classes = $derived(`item ${_stats.reset ? 'reset' : ''} background-bronze`);
    const ave = $derived(_stats.ave());
</script>

<div class="stats">
    <div class={classes}>
        puzzles  <div class="flow"><NumberFlow value={_stats.plays} /></div>
    </div>
    {#if _stats.plays}
        <div class={classes}>
            ave  {`${ave < 1 ? '' : '+'}`}
            <div class="flow"><NumberFlow value={ave} /></div>
        </div>
        <div class={classes}>
            best  {`${_stats.best < 1 ? '' : '+'}`}
            <div class="flow"><NumberFlow value={_stats.best} /></div>
        </div>
    {:else}
        <div class={classes}>ave</div>
        <div class={classes}>best</div>
    {/if}
</div>

<style>
    .stats {
        grid-area: 1/1;
        display: grid;
        grid-auto-flow: column;
        grid: auto / 1.3fr 1fr 1fr;
        height: 28px;
        width: 90%;
        place-self: center;
    }

    .item {
        width: 94%;
        box-sizing: border-box;
        font-family: 'Source Sans 3';
        font-size: 17px;
        border-radius: 50vh;
        height: 90%;
        padding: 0 0 2px;
        display: grid;
        grid-auto-flow: column;
        align-items: center;
        place-content: center;
        place-self: center;
        transition: 0.2s;
    }

    .reset {
        background: var(--gold);
    }

    .flow {
        margin-bottom: -2px;
    }
</style>
