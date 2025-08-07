<script>
    import { fade } from 'svelte/transition';
    import { GAME_PAGE, YOU_GAVE_UP } from './const';
    import { cleanupDemo } from './Demo/demo shared.svelte';
    import Help from './Help.svelte';
    import PromptButton from './Prompt Button.svelte';
    import { calculatePar, dayOfYear, isSolved, onStart, persist } from './shared.svelte';
    import { _sound } from './sound.svelte';
    import { _stats, ss } from './state.svelte';
    import { focusOnApp, post, windowSize } from './utils';

    let content = $state(null);
    let scale = $state(1);

    $effect(() => {
        post(() => {
            const { y: wy } = windowSize();
            const pageHi = content.getBoundingClientRect().height + 70;

            if (pageHi > wy) {
                scale = wy / pageHi;
            }
        });

        focusOnApp();
    });

    const reloadGame = (job) => {
        ss.cells = job.cells;
        ss.turns = job.turns;
        ss.center = job.center;
        ss.initial = job.initial;
        ss.steps = job.steps;
        ss.replay = job.replay;
        ss.surrender = job.surrender;

        post(() => {
            if (isSolved()) {
                ss.over = true;

                calculatePar();

                if (_stats.plays === 0) {
                    ss.cheer = ss.surrender = YOU_GAVE_UP;
                }
            }
        });
    };

    const loadGame = () => {
        const json = localStorage.getItem(ss.appKey());
        const job = JSON.parse(json);

        if (job) {
            _stats.plays = job.plays;
            _stats.total_score = job.total_score;
            _stats.best = job.best;

            if (!ss.daily) {
                reloadGame(job);
            } else {
                ss.day = job.day;

                const doy = dayOfYear();

                if (ss.day === doy) {
                    ss.replay = job.replay;
                    reloadGame(job);
                } else {
                    localStorage.clear();
                    ss.day = doy;
                    persist(true);
                }
            }
        } else if (ss.daily) {
            ss.day = dayOfYear();
        }
    };

    const onGoToGame = () => {
        cleanupDemo();

        ss.page = GAME_PAGE;
        post(() => (ss.seenGamePage = true));

        if (ss.cells) {
            post(isSolved, 1000);
        } else {
            _sound.play('score2');
            onStart();
        }
    };

    const onBinge = () => {
        ss.daily = false;
        loadGame();
        onGoToGame();
    };

    const onDaily = () => {
        ss.daily = true;
        loadGame();
        onGoToGame();
    };
</script>

<div class="start-page" in:fade={{ duration: 100 }} out:fade={{ duration: 200 }}>
    <div class="content" bind:this={content} style="transform: scale({scale})">
        <div class='title gradient-gold gradient-text'>HEXUM</div>
        {#if ss.daily}
            <div class="subtitle gradient-gold gradient-text">daily</div>
        {/if}
        <Help />
        {#if ss.daily === undefined}
            <div class="buttons">
                <PromptButton op={{ label: 'daily', onClick: onDaily }} />
                <PromptButton op={{ label: 'binge', onClick: onBinge }} />
            </div>
        {:else}
            <div class="buttons">
                <PromptButton op={{ label: ss.cells ? 'Back to Game' : 'Play', onClick: onGoToGame }} />
            </div>
        {/if}
    </div>
</div>

<style>
    .start-page {
        grid-area: 1/1;
        height: 100dvh;
        display: grid;
        place-content: center;
        z-index: 100;
        filter: drop-shadow(0 0 5px black);
    }

    .content {
        display: grid;
        gap: 50px;
    }

    .title {
        grid-area: 1/1;
        place-self: center;
        font-family: Trajan;
        font-weight: bold;
        font-size: 64px;
        margin-bottom: -20px;
    }

    .subtitle {
        grid-area: 1/1;
        font-family: 'Source Sans 3';
        font-size: 24px;
        place-self: end;
        transform: translate(-80%, 100%);
    }

    .buttons {
        grid-area: 3/1;
        place-self: center;
        display: grid;
        grid-auto-flow: column;
        gap: 20px;
    }
</style>
