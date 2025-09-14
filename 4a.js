const fs = require('fs');
const s = fs.readFileSync('./input.txt').toString();


const SEPARATOR = '';
function parseInput(str) {
    return str.split('\n').filter(Boolean).map(v => v.split(SEPARATOR));
}

function get(M, i, j) {
    return M[i]?.[j] ?? '';
}
function hasXmas(M, i, j) {

    const delta = [
        [-1, -1],
        [-1, 1]
    ];

    let s = 0;
    s += Number(delta.every(([dr, dc]) => {
        return ['MAS', 'SAM'].includes(get(M, i + dr, j + dc) + 'A' + get(M, i - dr, j - dc))
    }));

    return s;
}

function alg(M) {
    let s = 0;
    for(let i=0; i<M.length; i++) {
        for (let j = 0; j<M[0].length; j++) {
            s += M[i][j] === 'A' ? hasXmas(M, i, j) : 0;
        }
    }
    return s;
}

console.log(alg(parseInput(s)));