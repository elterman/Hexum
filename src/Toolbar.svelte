<script>
    import Question from '$lib/images/Question.webp';
    import MusicOff from '$lib/images/Music Off.webp';
    import MusicOn from '$lib/images/Music On.webp';
    import ResetStats from '$lib/images/Reset Stats.webp';
    import SoundOff from '$lib/images/Sound Off.webp';
    import SoundOn from '$lib/images/Sound On.webp';
    import Surrender from '$lib/images/Surrender.webp';
    import { PROMPT_RESET_STATS, PROMPT_SURRENDER, START_PAGE } from './const';
    import { cleanupDemo } from './Demo/demo shared.svelte';
    import { persist } from './shared.svelte';
    import { _sound } from './sound.svelte';
    import { _prompt, _stats, ss } from './state.svelte';
    import ToolButton from './Tool Button.svelte';

    const onHelp = () => {
        cleanupDemo();
        ss.page = START_PAGE;
    };

    const onSurrender = () => {
        if (_prompt.id == PROMPT_SURRENDER) {
            _prompt.opacity = 0;
            return;
        }

        _sound.play('plop');

        _prompt.set(PROMPT_SURRENDER);
    };

    const onResetStats = () => {
        if (_prompt.id == PROMPT_RESET_STATS) {
            _prompt.opacity = 0;
            return;
        }

        _sound.play('plop');
        _prompt.set(PROMPT_RESET_STATS);
    };

    const onSound = () => {
        _sound.sfx = !_sound.sfx;

        if (_sound.sfx) {
            _sound.play('won', { rate: 4 });
        }

        persist();
    };

    const onMusic = () => {
        _sound.music = !_sound.music;

        if (ss.cells.length === 0) {
            return;
        }

        if (_sound.music) {
            _sound.playMusic();
        } else {
            _sound.stopMusic();
        }

        persist();
    };
</script>

<div class="toolbar">
    <ToolButton id="tb-help" src={Question} onClick={onHelp} />
    <ToolButton id="tb-surrender" src={Surrender} onClick={onSurrender} disabled={ss.over || ss.surrender} />
    <ToolButton id="tb-reset-stats" src={ResetStats} onClick={onResetStats} disabled={_stats.plays === 0} />
    <ToolButton id="tb-sound" src={_sound.sfx ? SoundOn : SoundOff} onClick={onSound} />
    <ToolButton id="tb-music" src={_sound.music ? MusicOn : MusicOff} onClick={onMusic} />
</div>

<style>
    .toolbar {
        grid-area: 5/1;
        place-self: center;
        display: grid;
        grid-auto-flow: column;
        place-content: center;
        gap: 10px;
    }
</style>
