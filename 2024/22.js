const fs = require('fs');
const s = fs.readFileSync('./input.txt').toString();

function parseInput(str) {
    return str.split('\n');
}

const M = 1 << 24;
let n = 123;
const S = new Map();
const A = [];
while (!S.has(n)) {
    S.set(n, A.length);
    A.push(n);
    n = (n << 6) ^ n;
    n = n & 0x00FFFFFF;
    n = (n >> 5) ^ n;
    n = n & 0x00FFFFFF;
    n = (n << 11) ^ n;
    n = n & 0x00FFFFFF;
}

function findIthFrom(start, i) {
    const ix = S.get(start);
    return A[(ix + i) % (M - 1)];
}

// // Part 1
// console.log(
//     parseInput(s).map(i => {
//         const ret = findIthFrom(+i, 2000);
//         console.log(ret);
//         return ret;
//     }).reduce((a, b) => a + b)
// );


// Part 2

function findIthFromMod10(start, i) {
    return findIthFrom(start, i) % 10;
}
const SEQ = {};
let maxSeq = '';
let maxSeqVal = 0;
parseInput(s)
.forEach(i => {
    let d0 = i % 10;
    let d1 = findIthFromMod10(+i, 1);
    let d2 = findIthFromMod10(+i, 2);
    let d3 = findIthFromMod10(+i, 3);
    let curr = 4;
    const seenSequences = new Set();
    
    while (curr <= 2000) {
        const p = findIthFromMod10(+i, curr);
        const key = `${d1 - d0}.${d2 - d1}.${d3 - d2}.${p - d3}`;
        
        d0 = d1;
        d1 = d2;
        d2 = d3;
        d3 = p;
        curr++;

        if (seenSequences.has(key)) continue;
        seenSequences.add(key);
        SEQ[key] = (SEQ[key] ?? 0) + p;
        if (maxSeqVal < SEQ[key]) {
            maxSeqVal = SEQ[key];
            maxSeq = key;
        }   
    }

});

console.log(maxSeqVal);
