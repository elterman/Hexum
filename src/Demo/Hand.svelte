<script>
    import HandIcon from '$lib/images/Hand.webp';
    import { DEX_DX, DEX_DY } from '../const';
    import { ds } from '../state.svelte';
    import { post } from '../utils';
    import { nextStep, onRotateBlock, onRotateGrid } from './demo shared.svelte';

    const REACTION_DELAY = 300;
    const NEXT_STEP_DELAY = 2000;

    const translateTransform = $derived.by(() => {
        let x = 0;
        let y = 0;

        switch (ds.step) {
            case -1:
            case 1:
                x = -DEX_DX;
                break;
            case -2:
            case 2:
                x = DEX_DX;
                break;
            case -3:
            case 3:
                x = DEX_DX * 2.35;
                y = DEX_DY * 1.25;
                break;
            case -5:
            case 5:
            case -6:
            case 6:
                x = DEX_DX * 2.5;
                y = DEX_DY * 0.7;
                break;
            default:
                break;
        }

        return `translate(${x}px, ${y}px)`;
    });

    let scale = $state(1);

    $effect(() => {
        if (ds.step === 1) {
            post(() => (ds.once = false), 1000);
        }

        const onTransitionEnd = (e) => {
            const id = e.target.id;

            if (e.propertyName !== 'transform') {
                return;
            }

            if (id === 'hand') {
                post(() => (scale = 0.8), 300);
            } else if (id === 'icon') {
                if (scale < 1) {
                    scale = 1;

                    if (ds.step === 1) {
                        post(() => {
                            ds.twist = 1;
                            ds.turns[1] += 1;
                            onRotateBlock(1, true);
                            post(() => nextStep(), NEXT_STEP_DELAY);
                        }, REACTION_DELAY);
                    } else if (ds.step === 2) {
                        post(() => {
                            ds.twist = 4;
                            ds.turns[4] -= 1;
                            onRotateBlock(4, false);
                            post(() => nextStep(), NEXT_STEP_DELAY);
                        }, REACTION_DELAY);
                    } else if (ds.step === 3) {
                        post(() => {
                            ds.twist = 'cw';
                            ds.turns[0] += 1;
                            onRotateGrid(true);
                            post(() => nextStep(), 500);
                        }, REACTION_DELAY);
                    }
                }
            }
        };

        window.addEventListener('transitionend', onTransitionEnd);
        return () => window.removeEventListener('transitionend', onTransitionEnd);
    });
</script>

<div
    id="hand"
    class="hand {ds.once ? 'delay3' : ds.step === 1 ? 'delay2' : ''}"
    style="transform: {translateTransform}; margin-bottom: {-DEX_DY / 2}px;">
    <img id="icon" class="icon {scale < 1 ? 'scale' : ''}" src={HandIcon} alt="" width={35} />
</div>

<style>
    .hand {
        grid-area: 3/1;
        place-self: center;
        display: grid;
        z-index: 2;
        transition: transform 1s linear;
    }

    .delay2 {
        transition-delay: 2s;
    }

    .delay3 {
        transition-delay: 3s;
    }

    .icon {
        transition: 0.2s linear;
    }

    .scale {
        transform: scale(0.8);
    }
</style>
