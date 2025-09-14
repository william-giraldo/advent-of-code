const fs = require('fs');
const s = fs.readFileSync('./input.txt').toString();
// const s = `
// AAAAAA
// AAABBA
// AAABBA
// ABBAAA
// ABBAAA
// AAAAAA`;

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
    
    const cp = M.map(r => [...r]);

    let s = 0;
    for(let i=0; i<M.length; i++) {
        for (let j = 0; j<M[0].length; j++) {
            const v = get(M, i, j);
            if (v) {
                const map = {};
                let sides = 0, shape = [];
                let area = 0;
                let pos;
                const list = [[i, j]];
                while (pos = list.shift()) {                   

                    if (get(M, pos[0], pos[1]) === v) {
                        
                        for (let [dr, dc] of DIRS) {
                            if (get(M, pos[0] + dr, pos[1] + dc) === v) {
                                const key = `${pos[0] + dr}-${pos[1] + dc}`;
                                map[key] = (map[key] ?? 0) + 1;
                                if (map[key] > 2) {
                                    console.log('returning', key, map[key]);
                                    // return map;
                                }
                                list.push([pos[0] + dr, pos[1] + dc]);
                            }
                        };

                        area++;
                        M[pos[0]][pos[1]] = '';
                    }
                    
                }

                // console.log('about to return map', v);
                // return map;
                s += sides * area;
            }
        }
    }

    return s;

}

console.log(alg(parseInput(s)));