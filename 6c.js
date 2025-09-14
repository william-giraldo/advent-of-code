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

function getsToSamePoint(M, initPos, _dirIdx) {

    let pos = [...initPos];
    let dirIx = _dirIdx;

    let currDir = DIRS[dirIx];
    const obstacle = [pos[0] + currDir[0], pos[1] + currDir[1]];
    const S = new Set();


    while(pos[0] >= 0 && pos[0] < M.length && pos[1] >= 0 && pos[1] < M[0].length) {
        const currDir = DIRS[dirIx];

        const key = `${pos[0]}-${pos[1]}-${dirIx}`;
        if (!S.has(key)) {
            S.add(key);
        } else {
            return true;
        }


        let maybeNewPos = [pos[0] + currDir[0], pos[1] + currDir[1]];
        const nextChar = get(M, ...maybeNewPos);
        if (nextChar !== '#' && !(maybeNewPos[0] === obstacle[0] && maybeNewPos[1] === obstacle[1])) {
            pos = maybeNewPos;
        } else {
            dirIx = (dirIx + 1) % 4;
        }
    }

    return false;
}

function escapes(M, initPos, _key) {

    let pos = [...initPos];
    let dirIx = 0;

    const S = new Set();


    while(pos[0] >= 0 && pos[0] < M.length && pos[1] >= 0 && pos[1] < M[0].length) {
        const currDir = DIRS[dirIx];        

        const key = `${pos[0]}-${pos[1]}-${dirIx}`;
        if (!S.has(key)) {
            S.add(key);
        } else {
            return false;
        }

        let maybeNewPos = [pos[0] + currDir[0], pos[1] + currDir[1]];
        const nextChar = get(M, ...maybeNewPos);
        if (nextChar !== '#') {
            pos = maybeNewPos;
        } else {
            dirIx = (dirIx + 1) % 4;
        }
    }

    return true;
}

function alg(M) {
    const startRow = M.findIndex(a => a.includes('^'));
    const startCol = M[startRow].findIndex(v => v === '^');

    let pos = [startRow, startCol];
    let dirIx = 0;
    
    const loopSet = new Set();

    let n = 0;
    while(pos[0] >= 0 && pos[0] < M.length && pos[1] >= 0 && pos[1] < M[0].length) {
        const currDir = DIRS[dirIx];

        let maybeNewPos = [pos[0] + currDir[0], pos[1] + currDir[1]];
        const nextChar = get(M, ...maybeNewPos);
        if (nextChar !== '#') {
            oldPos = pos;
            pos = maybeNewPos;
            const key = `${maybeNewPos[0]}-${maybeNewPos[1]}`;
            if (
                nextChar && 
                !loopSet.has(key)
            ) {
                const gtsp = getsToSamePoint(M, oldPos, dirIx);
                
                M[pos[0]][pos[1]] = '#';
                const scp = escapes(M, [startRow, startCol], key);
                if (!scp) {
                    loopSet.add(key);
                }
                M[pos[0]][pos[1]] = '.';
                
                if (gtsp === scp) {
                    n++;
                    console.log('equal', oldPos, gtsp, scp, dirIx);
                }
            }
        } else {
            dirIx = (dirIx + 1) % 4;
        }
    }

    // console.log(S);
    
    return [loopSet.size, n];

}

console.log(alg(parseInput(s)));