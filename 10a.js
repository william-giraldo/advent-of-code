const fs = require('fs');
const s = fs.readFileSync('./input.txt').toString();

// const s = `
// 89010123
// 78121874
// 87430965
// 96549874
// 45678903
// 32019012
// 01329801
// 10456732`;

const SEPARATOR = '';
function parseInput(str) {
    return str.split('\n').filter(Boolean).map(v => v.split(SEPARATOR).map(v=>parseInt(v)));
}

function toStr(M) {
    return M.map(v => v.join('')).join('\n');
}

function get(M, i, j) {
    return M[i]?.[j] ?? -1;
}
const DIRS = [
    [-1, 0],
    [0, 1],
    [1, 0],
    [0, -1]
];

const DIRS_CHR = ['^', '>', 'v', '<'];

function hasObstacle(M, pos, dirIx) {
    const dir = DIRS[dirIx];
    let _pos = [...pos];
    let currChar = M[_pos[0]][_pos[1]];

    while(currChar !== '' && currChar !== '#') {
        _pos = [_pos[0] + dir[0], _pos[1] + dir[1]];
        currChar = get(M, _pos[0], _pos[1]);        
    }

    return currChar === '#';
}

const MAX = 9;

function findTrails(M, i, j, prev) {
    
    const v = get(M, i, j);
    // console.log('considering', i, j, prev, v)

    if (v < 0 || v !== prev + 1) {
        return [];
    }

    if (v === MAX) {
        return [[[i, j]]];
    }

    let trails = [];
    for (let [dr, dc] of DIRS) {
        trails = trails.concat(findTrails(M, i + dr, j + dc, v).map(trail => [[i, j]].concat(trail)));
    }

    return trails;

}

function alg(M) {

    const zeros = [];
    for (let i=0;i<M.length;i++) {
        for (let j=0;j<M[0].length;j++) {
            if(0 === M[i][j]) {
                zeros.push([i,j]);
            }
        }
    }


    let trails = [];
    let n = 0;
    for (let zero of zeros) {
        // trails = trails.concat();
        
        const curr = findTrails(M, zero[0], zero[1], -1);
        // const nines = curr.map(t => t[9]);
        // const S = new Set();
        // nines.forEach(([r,c]) => S.add(`${r}-${c}`));
        n += curr.length;
    }

    return n;

}

console.log(alg(parseInput(s)));