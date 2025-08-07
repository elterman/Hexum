import { dict3 } from '$lib/dicts/dict3';
import { dict4 } from '$lib/dicts/dict4';
import { dict5 } from '$lib/dicts/dict5';
import { pool } from '$lib/dicts/pool';
import { cloneDeep, random, sample } from 'lodash-es';
import { BLOCKS, CHEER_EXCELLENT, CHEER_GREAT, CHEER_PERFECT, CHEER_PHENOMENAL, CHEER_YOU_DID_IT, PROMPT_PLAY_AGAIN } from './const';
import { _sound } from './sound.svelte';
import { _prompt, _stats, ss } from './state.svelte';
import { post } from './utils';

let over = $state(false);

export const initPoss = () => {
    for (let i = 0; i < ss.cells.length; i++) {
        ss.cells[i].pos = i + 1;
    }
};

export const onOver = () => {
    if (over) {
        return;
    }

    over = true;

    calculatePar();

    const doOver = (prompt) => {
        ss.over = true;

        post(() => {
            delete ss.flip;
            _sound.play('won');

            post(() => {
                _prompt.set(prompt);

                if (prompt !== PROMPT_PLAY_AGAIN) {
                    post(() => {
                        _prompt.set(null);
                        post(() => _prompt.set(PROMPT_PLAY_AGAIN));
                    }, 2000);
                }
            }, 1000);
        }, 300);
    };

    if (ss.surrender) {
        _sound.play('cluck');
        post(() => ss.cheer = ss.surrender);
    } else {
        const score = ss.score();

        const cheer = () => {
            if (score < 0) {
                ss.cheer = CHEER_PHENOMENAL;
            } else if (score === 0) {
                ss.cheer = CHEER_PERFECT;
            } else if (score === 1) {
                ss.cheer = CHEER_EXCELLENT;
            } else if (score === 2) {
                ss.cheer = CHEER_GREAT;
            } else {
                ss.cheer = CHEER_YOU_DID_IT;
            }

            post(() => delete ss.cheer, 3000);
        };

        if (!ss.replay) {
            _stats.plays += 1;
            _stats.total_score += score;
        }

        if (!ss.replay && (_stats.best === null || score < _stats.best)) {
            _stats.best = score;
        }

        post(cheer);
    }

    delete ss.replay;

    post(() => doOver(PROMPT_PLAY_AGAIN), 500);
};

const randomPuzzle = () => {
    const pickWords = () => {
        let w1, w2, w3, w4, w5;

        w1 = sample(dict3);
        w2 = sample(dict4);
        w3 = sample(dict5);
        w4 = sample(dict4.filter(w => w !== w2));
        w5 = sample(dict3.filter(w => w !== w1));

        const chars = ((w1 + w2 + w3 + w4 + w5).split(''));
        ss.cells = [];

        for (const [i, ch] of chars.entries()) {
            ss.cells.push({ ch, pos: i + 1 });
        }

        return [w1, w2, w3, w4, w5];
    };

    const MIN_COUNT = 3;
    let count = 0;
    let words;

    // have at least MIN_COUNT 3-letter words
    do {
        words = pickWords();
        count = 0;

        for (const [i, b1] of BLOCKS.entries()) {
            const b2 = i === 5 ? BLOCKS[0] : BLOCKS[i + 1];

            let found = false;

            for (const [j, pos1] of b1.positions.entries()) {
                const pos2 = j === 2 ? b1.positions[0] : b1.positions[j + 1];

                for (const pos3 of b2.positions) {
                    const word = ss.cells[pos1 - 1].ch + ss.cells[pos2 - 1].ch + ss.cells[pos3 - 1].ch;

                    if (dict3.includes(word)) {
                        count += 1;
                        found = true;
                        break;
                    }
                }

                if (found) {
                    break;
                }
            }

            if (count === MIN_COUNT) {
                break;
            }
        }
    } while (count < MIN_COUNT);

    const acceptable = () => {
        if (isSolved(true)) {
            return false;
        }

        const parrs = [
            [[1, 2, 3], [3, 7, 12], [12, 16, 19], [19, 18, 17], [17, 13, 8], [8, 4, 1]],
            [[3, 2, 1], [12, 7, 3], [19, 16, 12], [17, 18, 19], [8, 13, 17], [1, 4, 8]]
        ];

        for (let i = 0; i < 2; i++) {
            const parr = parrs[i];

            if (parr.some(poss => wordAt(poss) === words[i ? 4 : 0])) {
                return false;
            };
        }

        return true;
    };

    do {
        ss.turns = [random(0, 5), random(0, 2), random(0, 2), random(0, 2), random(0, 2), random(0, 2), random(0, 2)];

        initPoss();

        for (let i = 0; i < 7; i++) {
            for (let j = 0; j < ss.turns[i]; j++) {
                if (i) {
                    onRotateBlock(i, true);
                } else {
                    onRotateGrid(true);
                }
            }
        }
    } while (!acceptable());
};

export const onRotateBlock = (bi, cw,) => {
    const cis = BLOCKS[bi - 1].positions;
    const poss = cis.map(i => ss.cells[i - 1].pos);

    for (let i = 0; i < 3; i++) {
        let pos = poss[i];

        if (cw) {
            pos = i < 2 ? poss[i + 1] : poss[0];
        } else {
            pos = i > 0 ? poss[i - 1] : poss[2];
        }

        const j = cis[i];
        ss.cells[j - 1].pos = pos;
    }
};

export const onRotateGrid = (cw) => {
    const newPos = (pos) => {
        switch (pos) {
            case 1: return cw ? 3 : 8;
            case 2: return cw ? 7 : 4;
            case 3: return cw ? 12 : 1;
            case 4: return cw ? 2 : 13;
            case 5: return cw ? 6 : 9;
            case 6: return cw ? 11 : 5;
            case 7: return cw ? 16 : 2;
            case 8: return cw ? 1 : 17;
            case 9: return cw ? 5 : 14;
            case 11: return cw ? 15 : 6;
            case 12: return cw ? 19 : 3;
            case 13: return cw ? 4 : 18;
            case 14: return cw ? 9 : 15;
            case 15: return cw ? 14 : 11;
            case 16: return cw ? 18 : 7;
            case 17: return cw ? 8 : 19;
            case 18: return cw ? 13 : 16;
            case 19: return cw ? 17 : 12;
            default: return pos;
        }
    };

    for (let i = 0; i < 19; i++) {
        ss.cells[i].pos = newPos(ss.cells[i].pos);
    }
};

const makePool = () => {
    const pool = [];

    for (let i = 0; i < 366; i++) {
        randomPuzzle();

        const daily = ss.turns.join('') + ss.cells.map(cell => `${cell.ch}${cell.pos}`).join('•');
        pool.push(daily);
    }

    return pool;
};

const pickDaily = () => {
    const doy = dayOfYear();
    const daily = pool[doy - 1];

    ss.turns = daily.slice(0, 7).split('').map(d => +d);

    const chposs = daily.slice(7).split('•');
    ss.cells = [];

    for (const cp of chposs) {
        const ch = cp.slice(0, 1);
        const pos = +cp.slice(1);
        ss.cells.push({ ch, pos });
    }
};

export const makePuzzle = () => {
    post(() => {
        const initial = () => ({ cells: cloneDeep(ss.cells), turns: cloneDeep(ss.turns) });

        if (ss.daily) {
            pickDaily();
            ss.initial = initial();
        } else if (ss.replay) {
            const { cells, turns } = ss.initial;
            ss.cells = cloneDeep(cells);
            ss.turns = cloneDeep(turns);
        } else {
            randomPuzzle();
            ss.initial = initial();
        }

        calculatePar();
        persist();
    });
};

export const onStart = (replay = false) => {
    _sound.play('dice');
    over = false;

    if (ss.cells) {
        ss.flip = true;

        if (replay) {
            ss.replay = true;
        }
    } else {
        makePuzzle();
    }

    ss.steps = 0;

    delete ss.over;
    delete ss.cheer;
    delete ss.surrender;
    delete ss.center;

    persist();
};

export const onResetStats = () => {
    if (false) {
        makePool();
        return;
    }

    if (_stats.plays === 0) {
        return;
    }

    _stats.plays = 0;
    _stats.total_score = 0;
    _stats.best = null;
    persist();

    _stats.reset = true;
    post(() => delete _stats.reset, 1500);
};

export const persist = (statsOnly = false) => {
    const json = statsOnly ? { ..._stats } : {
        ..._stats, day: ss.day || 0, cells: ss.cells, turns: ss.turns, center: ss.center, steps: ss.steps, replay: ss.replay, initial: ss.initial, surrender: ss.surrender,
    };

    localStorage.setItem(ss.appKey(), JSON.stringify(json));
};

export const log = (value) => console.log($state.snapshot(value));

export const isSolved = (ignoreCenter = false) => {
    if (!ss.cells) {
        return false;
    }

    if (!ignoreCenter && !ss.center) {
        return false;
    }

    const w1 = wordAt([1, 2, 3]);
    const w2 = wordAt([4, 5, 6, 7]);
    const w3 = wordAt([8, 9, 10, 11, 12]);
    const w4 = wordAt([13, 14, 15, 16]);
    const w5 = wordAt([17, 18, 19]);

    if (!dict3.includes(w1) || !dict4.includes(w2) || !dict5.includes(w3) || !dict4.includes(w4) || !dict3.includes(w5)) {
        return false;
    }

    if (w1 === w5 || w2 === w4) {
        return false;
    }

    return true;
};

export const dayOfYear = () => {
    const date = new Date();
    const year = date.getFullYear();
    const day = (Date.UTC(year, date.getMonth(), date.getDate()) - Date.UTC(year, 0, 0)) / 24 / 60 / 60 / 1000;

    return day;
};

export const calculatePar = () => {
    const turns = calcSolutionTurns(ss.initial.turns);
    ss.par = turns.reduce((sum, turns) => sum + Math.abs(turns), 0) + 1;
};

const calcGridTurns = (gridTurns) => {
    let turns = gridTurns % 6;

    if (turns > 0) {
        if (turns < 4) {
            turns = -turns;
        } else {
            turns = 6 - turns;
        }
    } else if (turns < 0) {
        if (turns > -4) {
            turns = -turns;
        } else {
            turns = -6 - turns;
        }
    }

    return turns;
};

const calcBlockTurns = (blockTurns) => {
    let turns = blockTurns % 3;

    if (turns === -2 || turns === 1) {
        turns = -1;
    } else if (turns === -1 || turns === 2) {
        turns = 1;
    }

    return turns;
};

export const calcSolutionTurns = (turns) => {
    const solTurns = [];

    solTurns.push(calcGridTurns(turns[0]));

    for (let i = 0; i < 6; i++) {
        solTurns.push(calcBlockTurns(turns[i + 1]));
    }

    return solTurns;
};

const charAt = (pos) => {
    if (pos === 10) {
        return ss.center || ss.cells[9].ch;
    }

    return ss.cells.find(cell => cell.pos === pos).ch;
};

const wordAt = (poss) => poss.reduce((word, pos) => word + charAt(pos), '');
