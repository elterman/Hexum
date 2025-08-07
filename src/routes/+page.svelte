<script>
    import StartPage from '../Start Page.svelte';
    import GamePage from '../Game Page.svelte';
    import Splash from '../Splash.svelte';
    import { post, underMouse } from '../utils';
    import { ss } from '../state.svelte';
    import { START_PAGE } from '../const';
    import WordList from '../Word List.svelte';

    $effect(() => {
        const disable = (e) => {
            e.preventDefault();
        };

        window.addEventListener('contextmenu', disable);
        window.addEventListener('dblclick', disable);

        return () => {
            window.removeEventListener('contextmenu', disable);
            window.removeEventListener('dblclick', disable);
        };
    });

    let splash = $state(true);
    post(() => (splash = false), 2000);

    const onPointerDown = (e) => {
        if (ss.keyboard) {
            if (!underMouse(e, ['.keyboard', '#tb-sound'])) {
                delete ss.keyboard;
            }

            return;
        }

        if (ss.showDictionary) {
            if (!underMouse(e, ['keyboard', '.wordlist', '#tb-wordlist', '#tb-sound'])) {
                delete ss.showDictionary;
            }
        }
    };
</script>

<div class="app" onpointerdown={onPointerDown}>
    <div class="vignette"></div>
    <GamePage />

    {#if ss.showDictionary}
        <WordList />
    {/if}

    {#if ss.page === START_PAGE}
        <StartPage />
    {/if}

    {#if splash}
        <Splash />
    {/if}
</div>

<style>
    :root {
        --gold: #ffe4ad;
        --silver: #dfe1e5;
        --bronze: #eeae93;
        --background: #461a54;
        --offwhite: #f0f8ff; /* aliceblue */
        --blue: #80bfff;
        --lightblue: #c5e2ff;
    }

    :global {
        body {
            margin: 0;
            overflow: hidden;
        }

        .button-base {
            box-sizing: border-box;
            cursor: pointer;
            display: grid;
            place-content: center;
            transition: transform 0.1s;
        }

        .button-base:focus {
            outline: none !important;
        }

        .no-highlight {
            -webkit-tap-highlight-color: transparent;
            -webkit-touch-callout: none;
            -webkit-user-select: none;
            -khtml-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
        }

        .gradient-gray {
            background: -webkit-linear-gradient(-90deg, #888888, #888888 50%, #888888 100%);
        }

        .gradient-gold {
            background: -webkit-linear-gradient(-90deg, #ede2c5, #ffe4ad 50%, #d8ac3c 100%);
        }

        .gradient-silver {
            background: -webkit-linear-gradient(-90deg, #dfe1e5, #b3b5b6 50%, #b6b5ba 100%);
        }

        .gradient-bronze {
            background: -webkit-linear-gradient(-90deg, #d2a0a6, #b17682 50%, #8e5c74 100%);
        }

        .gradient-blue {
            background: -webkit-linear-gradient(-90deg, #ede2c5, #ffe4ad 50%, #d8ac3c 100%);
            filter: hue-rotate(180deg);
        }

        .gradient-text {
            background-clip: text;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .root-scroll {
            display: grid;
            overflow: auto;
            -webkit-overflow-scrolling: touch;
        }

        .root-scroll::-webkit-scrollbar {
            width: 10px;
            height: 10px;
        }

        .root-scroll::-webkit-scrollbar-thumb:hover {
            /* background: #fff5; */
            background: #c5e2ffd0;
        }

        .root-scroll::-webkit-scrollbar-thumb {
            border-radius: 50vw;
            /* background: #fff4; */
            background: #c5e2ffb0;
        }

        /* .root-scroll::-webkit-scrollbar-track {
        background: #fff2;
        } */

        .root-scroll::-webkit-scrollbar-track:hover {
            background: #ffffff05;
        }

        .root-scroll-mobile::-webkit-scrollbar {
            width: 2px;
            height: 2px;
        }

        .root-scroll-mobile::-webkit-scrollbar-thumb {
            border-radius: 1px;
        }
    }

    .app {
        display: grid;
        height: 100dvh;
        -webkit-user-select: none;
        user-select: none;
        overflow: hidden;
        touch-action: manipulation;
        outline: none !important;
        background: var(--background);
        background-image: url('$lib/images/Pattern.webp');
        background-size: 100px;
    }

    .vignette {
        grid-area: 1/1;
        background-image: radial-gradient(transparent, black 150%);
    }

    @font-face {
        font-family: Source Sans 3;
        src: url('$lib/fonts/Source Sans 3.ttf');
    }

    @font-face {
        font-family: Poppins;
        src: url('$lib/fonts/Poppins.ttf');
    }

    @font-face {
        font-family: Roboto;
        src: url('$lib/fonts/Roboto.ttf');
    }

    @font-face {
        font-family: Roboto Condensed;
        src: url('$lib/fonts/Roboto Condensed.ttf');
    }

    @font-face {
        font-family: Roboto Mono;
        src: url('$lib/fonts/Roboto Mono.ttf');
    }

    @font-face {
        font-family: Trajan;
        src: url('$lib/fonts/Trajan.otf');
    }
</style>
