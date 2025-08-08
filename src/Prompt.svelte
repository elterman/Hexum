<script>
    import { PROMPT_NO, PROMPT_PLAY_AGAIN, PROMPT_RESET_STATS, PROMPT_SURRENDER, YOU_GAVE_UP, YOU_GAVE_UP_STATS_RESET } from './const';
    import PromptPanel from './Prompt Panel.svelte';
    import { calcSolutionTurns, initPoss, isSolved, onOver, onResetStats, onStart } from './shared.svelte';
    import { _prompt, _stats, ss } from './state.svelte';

    const label = $derived(_prompt.id);
    const cheer = $derived(label.endsWith('!'));

    const onSurrender = () => {
        ss.surrender = _stats.plays && !ss.replay ? YOU_GAVE_UP_STATS_RESET : YOU_GAVE_UP;
        ss.center = ss.cells[9].ch;

        if (isSolved()) {
            onOver();
        } else {
            const turns = calcSolutionTurns(ss.turns);

            for (let i = 0; i < 7; i++) {
                ss.turns[i] += turns[i];
            }

            initPoss();
        }

        if (!ss.replay) {
            onResetStats();
        }
    };

    $effect(() => {
        const onTransitionEnd = (e) => {
            const id = e.target.id;

            if (id !== 'prompt') {
                return false;
            }

            if (e.propertyName !== 'opacity') {
                return;
            }

            if (_prompt.opacity == 0) {
                _prompt.set(ss.over ? PROMPT_PLAY_AGAIN : null);
            }
        };

        window.addEventListener('transitionend', onTransitionEnd);
        return () => window.removeEventListener('transitionend', onTransitionEnd);
    });
</script>

<div id="prompt" class="prompt {_prompt.opacity ? 'visible' : ''}">
    {#if label === PROMPT_PLAY_AGAIN}
        {#if ss.daily}
            <PromptPanel ops={[{ label: 'replay this puzzle?', onClick: () => onStart(true) }]} />
        {:else}
            <PromptPanel
                ops={[
                    { label: 'replay?', onClick: () => onStart(true) },
                    { label: 'play new?', onClick: onStart },
                ]} />
        {/if}
    {:else if label === PROMPT_SURRENDER}
        <PromptPanel ops={[{ label, onClick: onSurrender }, { label: PROMPT_NO }]} />
    {:else if label === PROMPT_RESET_STATS}
        <PromptPanel ops={[{ label, onClick: onResetStats }, { label: PROMPT_NO }]} />
    {:else if label}
        <PromptPanel ops={[{ label }]} readOnly={cheer} />
    {:else}
        <div class="placeholder"></div>
    {/if}
</div>

<style>
    .prompt {
        grid-area: 4/1;
        place-self: center;
        margin-top: 15px;
        transform: scale(0);
        opacity: 0;
        z-index: 1;
        transition: 0.3s;
    }

    .visible {
        opacity: 1;
        transform: scale(1);
    }

    .placeholder {
        height: 36px;
    }
</style>
