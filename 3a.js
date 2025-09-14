const fs = require('fs');
const s = fs.readFileSync('./input.txt').toString();
// const s = `xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))`;

function parseInput(str) {
    return str;
}

function alg(str) {
    const mulRegexp = /mul\((\d+),(\d+)\)/g;
    const doRegexp = /do(n't)?\(\)/g

    const intervals = [];
    let last = true;
    let lastIdx = 0;
    let sum = 0;

    let idx;
    for (let match of s.matchAll(doRegexp)) {
        const txt = match[0];
        idx = match.index;
        if (last) {
            if (txt === "don't()") {
                last = false;
                intervals.push([lastIdx, idx]);
            }
        } else if (txt === 'do()') {
            last = true;
            lastIdx = idx + 4;
        }
    }

    if (last) {
        intervals.push([lastIdx, str.length]);
    }

    intervals.forEach(([start, end]) => {
        for (let [_, a, b] of str.substring(start, end).matchAll(mulRegexp)) {
            sum += a*b;
        }
    })
    return sum;

}

console.log(parseInput(alg(s)));