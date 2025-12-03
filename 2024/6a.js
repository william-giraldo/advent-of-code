const fs = require('fs');
const s = fs.readFileSync('./input.txt').toString();
// const s = `
// ....#.....
// .........#
// ..........
// ..#.......
// .......#..
// ..........
// .#..^.....
// ........#.
// #.........
// ......#...`;

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

function roam(M, initPos, _dirIdx) {

    let pos = [...initPos];
    let dirIx = _dirIdx;
    const S = [];

    while(pos[0] >= 0 && pos[0] < M.length && pos[1] >= 0 && pos[1] < M[0].length) {
        const currDir = DIRS[dirIx];

        const key = `${pos[0]}-${pos[1]}-${dirIx}`;
        if (!S.includes(key)) {
            S.push(key);
        } else {
            return S;
        }


        let maybeNewPos = [pos[0] + currDir[0], pos[1] + currDir[1]];
        const nextChar = get(M, ...maybeNewPos);
        if (nextChar !== '#') {
            pos = maybeNewPos;
        } else {
            dirIx = (dirIx + 1) % 4;
        }
    }

    return S;
}

function alg(M) {
    const startRow = M.findIndex(a => a.includes('^'));
    const startCol = M[startRow].findIndex(v => v === '^');

    let pos = [startRow, startCol];
    let dirIx = 0;
    const S = new Set();
    
    const R = roam(M, pos, dirIx);
    
    return ['107-42-0', '107-42-1', '107-42-2', '107-42-3'].map(v => R.indexOf(v));

}

console.log(alg(parseInput(s)));