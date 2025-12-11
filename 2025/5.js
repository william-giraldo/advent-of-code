const fs = require('fs');
const s = fs.readFileSync('./input.txt').toString();

function parseInput(str) {
    const [ranges, ids] = str.split('\n\n');
    return [ranges.split('\n').map(l =>
        l.split('-').map(v => +v)
    ), ids.split('\n').map(v => +v)];
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
function alg([ranges, ids]) {
    let nRanges = [];
    ranges.forEach((range) => {
        const overlapping = nRanges.findIndex((r) => overlaps(r, range));
        if (overlapping === -1) {
            nRanges.push(range);
        } else {
            const left = Math.min(nRanges[overlapping][0], range[0]);
            let right = 0;
            for (let i = overlapping; i < nRanges.length && overlaps(nRanges[i], range); i++) {
                right = Math.max(nRanges[i][1], range[1]);
                nRanges[i] = null;
            }
            nRanges.push([left, right]);
        }
        nRanges = nRanges.filter(Boolean);
        nRanges.sort(([a1], [a2]) => a1 - a2);

    });
    
    assert(() => {
        let doesntOverlap = true;
        for (let i = 0; i < nRanges.length; i++) {
            for (j = i+1; j < nRanges.length; j++) {
                doesntOverlap = doesntOverlap && !overlaps(nRanges[i], nRanges[j]);
            }
        }
        return doesntOverlap;
    })

    assert(() => {
        let greater = true;
        for (let i = 0; i < nRanges.length; i++) {
            for (j = i+1; j < nRanges.length; j++) {
                greater = greater && (nRanges[j][0] > nRanges[i][1]);
            }
        }
        return greater;
    })

    // return nRanges;
    return nRanges.reduce((acc, [a, b]) => acc + BigInt(b - a + 1), BigInt(0));
}

console.log(alg(parseInput(s)));