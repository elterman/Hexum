import { BLOCKS, CYPHER, ROWS, ZERO_AT } from '../const';
import { ds } from '../state.svelte';
import { post } from '../utils';

let over = $state(false);

export const onStart = () => {
    over = false;
    ds.step = 1;

    if (ds.cells) {
        ds.flip = true;
    } else {
        makePuzzle();
    }

    delete ds.over;

    post(() => ds.started = true, 100);
};

export const nextStep = () => {
    ds.step = -ds.step;
};

export const makePuzzle = () => {
    ds.sum = 7;

    const w1 = '9G5';
    const w2 = '8CB4';
    const w3 = 'C079F';
    const w4 = '29H4';
    const w5 = '9C1';

    const chars = ((w1 + w2 + w3 + w4 + w5).split(''));
    ds.cells = [];

    for (const [i, ch] of chars.entries()) {
        ds.cells.push({ ch, pos: i + 1 });
    }

    ds.turns = [5, 2, 0, 0, 1, 0, 0];

    for (let i = 0; i < 7; i++) {
        for (let j = 0; j < ds.turns[i]; j++) {
            if (i) {
                onRotateBlock(i, true);
            } else {
                onRotateGrid(true);
            }
        }
    }
};

export const onRotateBlock = (bi, cw,) => {
    const cis = BLOCKS[bi - 1].positions;
    const poss = cis.map(i => ds.cells[i - 1].pos);

    for (let i = 0; i < 3; i++) {
        let pos = poss[i];

        if (cw) {
            pos = i < 2 ? poss[i + 1] : poss[0];
        } else {
            pos = i > 0 ? poss[i - 1] : poss[2];
        }

        const j = cis[i];
        ds.cells[j - 1].pos = pos;
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
        ds.cells[i].pos = newPos(ds.cells[i].pos);
    }
};

export const decode = ch => CYPHER.indexOf(ch) - ZERO_AT;

const rowSum = (row) => row.reduce((sum, n) => sum + n, 0);

const word2row = (word) => word.split('').map(decode);

const isWordSolved = (word) => {
    const row = word2row(word);
    const sum = rowSum(row);

    return sum === ds.sum;
};
export const isSolved = () => {
    if (!ds.cells) {
        return false;
    }

    const w1 = wordAt(ROWS[0]);
    const w2 = wordAt(ROWS[1]);
    const w3 = wordAt(ROWS[2]);
    const w4 = wordAt(ROWS[3]);
    const w5 = wordAt(ROWS[4]);

    for (const word of [w1, w2, w3, w4, w5]) {
        if (!isWordSolved(word)) {
            return false;
        }
    }

    return true;
};

export const onOver = () => {
    if (over) {
        return;
    }

    over = true;

    const doOver = () => {
        ds.over = true;

        post(() => {
            delete ds.flip;
        }, 300);
    };

    post(() => doOver(), 500);
};

const charAt = (pos) => ds.cells?.find(cell => cell.pos === pos).ch;

const wordAt = (poss) => poss.reduce((word, pos) => word + charAt(pos), '');

export const cleanupDemo = () => {
    delete ds.flip;
    delete ds.keyboard;
    delete ds.step;
};