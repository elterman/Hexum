<script>
    import { START_PAGE } from '../const';
    import GamePage from '../Game Page.svelte';
    import Splash from '../Splash.svelte';
    import StartPage from '../Start Page.svelte';
    import { ss } from '../state.svelte';
    import { post, underMouse } from '../utils';

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
    };
</script>

<div class="app" onpointerdown={onPointerDown}>
    <div class="vignette"></div>
    <GamePage />

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
        --aqua: #adffe4;
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
            background: -webkit-linear-gradient(-90deg, #d7adb2, #c1909a 50%, #a1768a 100%);
        }

        .clip-text {
            background-clip: text;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .background-aqua-radial {
            background-image: url('$lib/images/Aqua Radial.webp');
            background-size: cover;
        }

        .background-gold-radial {
            background-image: url('$lib/images/Gold Radial.webp');
            background-size: cover;
        }

        .background-silver-radial {
            background-image: url('$lib/images/Silver Radial.webp');
            background-size: cover;
        }

        .background-bronze-radial {
            background-image: url('$lib/images/Bronze Radial.webp');
            background-size: cover;
        }

        .background-gold {
            background-image: url('$lib/images/Gold.webp');
            background-size: cover;
        }

        .background-silver {
            background-image: url('$lib/images/Silver.webp');
            background-size: cover;
        }

        .background-bronze {
            background-image: url('$lib/images/Bronze.webp');
            background-size: cover;
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
        font-family: 'Source Sans 3';
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
