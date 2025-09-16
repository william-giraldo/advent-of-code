const fs = require('fs');
const s = fs.readFileSync('./input.txt').toString();

function parseInput(str) {
    return str.split('\n');
}
const NUMERIC_KEYPAD = {
    7: [0, 0],
    8: [0, 1],
    9: [0, 2],
    4: [1, 0],
    5: [1, 1],
    6: [1, 2],
    1: [2, 0],
    2: [2, 1],
    3: [2, 2],
    0: [3, 1],
    A: [3, 2]
};

const PRECOMPUTED = {
    'A-^': ['<A'],
    'A->': ['vA'],
    'A-v': ['<vA', 'v<A'],
    'A-<': ['v<<A', '<v<A'],
    '^-A': ['>A'],
    '^->': ['v>A', '>vA'],
    '^-v': ['vA'],
    '^-<': ['v<A'],
    '>-A': ['^A'],
    '>-^': ['^<A', '<^A'],
    '>-v': ['<A'],
    '>-<': ['<<A'],
    'v-A': ['^>A', '>^A'],
    'v-^': ['^A'],
    'v->': ['>A'],
    'v-<': ['<A'],
    '<-A': ['>>^A', '>^>A'] ,
    '<-^': ['>^A'],
    '<->': ['>>A'],
    '<-v': ['>A']
};

function getPathsForNumeric(str, startPos) {
    const next = str[0];
    if (!next) {
        return [''];
    }

    if (startPos[0] === 3 && startPos[1] === 0) return [];

    const endPos = NUMERIC_KEYPAD[next];

    if (endPos[0] === startPos[0] && endPos[1] === startPos[1]) {
        return getPathsForNumeric(str.slice(1), endPos).map(p => 'A' + p);
    } else if (endPos[0] === startPos[0]) {
        const P = Array(Math.abs(endPos[1] - startPos[1])).fill(endPos[1] > startPos[1] ? '>' : '<').concat(['A']).join('');
        return getPathsForNumeric(str.slice(1), endPos).map(p => P + p);
    } else if (endPos[1] === startPos[1]) {
        const P = Array(Math.abs(endPos[0] - startPos[0])).fill(endPos[0] > startPos[0] ? 'v' : '^').concat(['A']).join('');
        return getPathsForNumeric(str.slice(1), endPos).map(p => P + p);
    } else {
        const ver = getPathsForNumeric(str, [startPos[0] > endPos[0] ? startPos[0] - 1 : startPos[0] + 1,  startPos[1]])
        const hor = getPathsForNumeric(str, [startPos[0], startPos[1] > endPos[1] ? startPos[1] - 1 : startPos[1] + 1]);
        
        return ver.map(p => (startPos[0] > endPos[0] ? '^' : 'v') + p).concat(
            hor.map(p => (startPos[1] > endPos[1] ? '<' : '>') + p)
        );
    }
}

const NUM_KEYPADS = 26;
let CACHE = Array(NUM_KEYPADS - 2);

function calcTransition(dst, org, l) {
    const key = `${org}-${dst}`;

    if (dst === org) return 1;
    if (l == NUM_KEYPADS - 1){
        return PRECOMPUTED[key][0].length;
    }

    if (!CACHE[l - 1]) {
        CACHE[l - 1] = {};
    }

    if (key in CACHE[l - 1]) {
        return CACHE[l - 1][key];
    }

    const res = Math.min(...PRECOMPUTED[key].map(path => calcString(path, l + 1)));
    CACHE[l - 1][key] = res;
    return res;
}

function calcString(str, l) {
    let s = 0;
    let prev = 'A';
    for (let c of str) {
        const t = calcTransition(c, prev, l);
        s += t;
        prev = c;
    }
    return s;
}

function alg(codes) {
    let s = 0;
    for (let code of codes) {
        const sa = Math.min(...getPathsForNumeric(code, [3, 2]).map(path => calcString(path, 1)));
        s += code.split('').filter(v => /\d/.test(v)).join('') * sa;
    }
    return s;
}

console.log(alg(parseInput(s)));