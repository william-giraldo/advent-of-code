const fs = require('fs');
const s = fs.readFileSync('./input.txt').toString();

function parseInput(str) {
    const M = str.split('\n').map(l => l.split(''));
    return M
}

function digits(v) {
    if (v === 0) {
        return 1;
    }
    return (Math.log10(v) >>> 0) + 1;
}
function get(M, i, j) {
    return M[i]?.[j];
}

function overlaps(a, b) {
    return b[0] <= a[1] && b[1] >= a[0];
}
function assert(predicate) {
    if (!predicate()) {
        throw new Error("Assertion failed", predicate.toString());
    }
}
function alg(M) {
    
    const start = M[0].findIndex(c => c === 'S');
    let timelines = Array(M[0].length).fill(0);
    timelines[start] = 1;
    for (let i = 1; i < M.length; i++) {
        const nTimelines = Array(timelines.length).fill(0); 
        for (let j = 0; j < timelines.length; j++) {
            if (M[i][j] === '^') {
                nTimelines[j] = 0;
                nTimelines[j - 1] = nTimelines[j - 1] + timelines[j];
                nTimelines[j + 1] = timelines[j];
            } else {
                nTimelines[j] = timelines[j] + nTimelines[j];
            }
        }
        timelines = nTimelines;
    }

    // return timelines;
    return timelines.reduce((acc, curr) => acc + curr);
}

console.log(alg(parseInput(s)));