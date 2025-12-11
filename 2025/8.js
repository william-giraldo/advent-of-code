const fs = require('fs');
const s = fs.readFileSync('./input.txt').toString();

function parseInput(str) {
    const M = str.split('\n').map(l => l.split(',').map(v => +v));
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

function dist(a, b) {
    return Math.sqrt(
        (a[0] - b[0])*(a[0] - b[0]) +
        (a[1] - b[1])*(a[1] - b[1]) +
        (a[2] - b[2])*(a[2] - b[2])
    );
}

const SLICE = 1000;
function alg(M) {
    const pairs = [];
    const circuits = {};

    for (let i = 0; i < M.length; i++) {
        const joint = M[i].join(',');
        circuits[joint] = new Set();
        circuits[joint].add(joint);

        for (let j = i + 1; j < M.length; j++) {
            pairs.push([M[i], M[j]]);
        }
    }

    pairs.sort((P1, P2) => dist(P1[0], P1[1]) - dist(P2[0], P2[1]));

    // const sliced = pairs.slice(0, SLICE);
    let nSets = M.length;
    for (let [P1, P2] of pairs) {
        const s1 = circuits[P1.join(',')];
        const s2 = circuits[P2.join(',')];

        const [minS, maxS] = s1.size > s2.size ? [s2, s1] : [s1, s2];

        if (minS === maxS) {
            continue;
        }
        
        minS.forEach((P) => {
            maxS.add(P);
            circuits[P] = maxS;
        });

        nSets--;
        if (nSets === 1) {
            return P1[0]*P2[0];
        }
    }
    
}

console.log(alg(parseInput(s)));