const fs = require('fs');
const s = fs.readFileSync('./input.txt').toString();
// const s = `7 6 4 2 1
// 1 2 7 8 9
// 9 7 6 2 1
// 1 3 2 4 5
// 8 6 4 4 1
// 1 3 6 7 9`;

const SEPARATOR = ' ';
function parseInput(str) {
    return str.split('\n').filter(Boolean).map(v => v.split(SEPARATOR).map(k => parseInt(k)));
}

function safe(v) {
    const f = (a, b) => a-b;
    let s = 0;
    if (['' + [...v].sort(f),
        '' + [...v].sort(f).reverse()].includes('' + v)) {
            s += v.every((k, i) => i === 0 || (Math.abs(k - v[i - 1]) > 0 && Math.abs(k - v[i - 1]) <= 3))
                ? 1
                : 0;
        }
    return s;
}

function removeNth(v, n) {
    return v.filter((_, i) => i !== n);
}
function alg(list) {
    let s = 0;
    list.forEach((v) => {
        s += Number(safe(v) > 0 || v.some((k, j) => safe(removeNth(v, j)) > 0));
    });
    return s;
}

console.log(alg(parseInput(s)));