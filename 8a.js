const fs = require('fs');
const s = fs.readFileSync('./input.txt').toString();
// const s = `
// ............
// ........0...
// .....0......
// .......0....
// ....0.......
// ......A.....
// ............
// ............
// ........A...
// .........A..
// ............
// ............`;

// const s = `
// ....#.....
// .........#
// ..........
// ..#.......
// .......#..
// ..........
// .#..^.....
// ........#.
// #.#.......
// ......#...`;

const SEPARATOR = '';
function parseInput(str) {
    return str.split('\n').filter(Boolean).map(v => v.split(SEPARATOR));
}

function toStr(M) {
    return M.map(v => v.join('')).join('\n');
}

function get(M, i, j) {
    return M[i]?.[j] ?? '';
}
const DIRS = [
    [-1, 0],
    [0, 1],
    [1, 0],
    [0, -1]
];


function set(M, i, j, v) {
    if (M[i]?.[j]) {
        M[i][j] = v;
        return true;
    }
    return false;
}
function alg(M) {
    const aM = {};
    const cp = M.map(r => Array(r.length).fill('.'));

    for (let i=0;i<M.length;i++) {
        for (let j=0;j<M[0].length;j++) {
            if(/[0-9a-zA-Z]/.test(M[i][j])) {
                aM[M[i][j]] = (aM[M[i][j]] ?? []).concat([[i, j]]);
            }
        }
    }

    console.log(aM);
    Object.entries(aM).map(([k, a]) => {
        for (let i=0;i<a.length;i++) {
            const curr = a[i];
            for (let j=i + 1;j<a.length;j++) {
                const next = a[j];
                const diff = [next[0] - curr[0], next[1] - curr[1]];
                
                for(let k=0; set(cp, next[0] + k*diff[0], next[1] + k*diff[1], '#'); k++) {}
                for(let k=0; set(cp, curr[0] - k*diff[0], curr[1] - k*diff[1], '#'); k++) {}
                
            }
        }
    });

    let n = 0;
    for (let i=0;i<cp.length;i++) {
        for (let j=0;j<cp[0].length;j++) {
            if('#' === cp[i][j]) {
                n++;
            }
        }
    }
    
    console.log(toStr(cp));

    return n++;
}

console.log(alg(parseInput(s)));