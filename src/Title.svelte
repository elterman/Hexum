<script>
    import { random } from 'lodash-es';

    const word = 'HEXUM';
</script>

    <div class="row">
        {#each word as ch, i (i)}
            {@const deg = i === 2 ? 0 : random(-40, 40)}
            {@const background = i < 2 ? '#8dd9ff' : i > 2 ? '#e8c3ff' : '#ffffab'}
            <div class="hex" style="transform: rotate({deg}deg); background: {background}">
                {ch}
            </div>
        {/each}
</div>

<style>
    .row {
        grid-area: 1/1;
        place-self: center;
        display: grid;
        grid-auto-flow: column;
        gap: 2px;
    }

    .hex {
        display: grid;
        place-content: center;
        font-family: Poppins;
        font-weight: bold;
        font-size: calc(min(7dvw, 32px));
        height: calc(min(18dvw, 64px));
        aspect-ratio: cos(30deg);
        clip-path: polygon(-50% 50%, 50% 100%, 150% 50%, 50% 0);
    }
</style>
