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
                let sides = 0, shape = [];
                let area = 0;
                let pos;
                const list = [[i, j]];
                while (pos = list.shift()) {
                    if (get(M, pos[0], pos[1]) === v) {

                        DIRS.forEach(([dr, dc]) => {
                            if (get(M, pos[0] + dr, pos[1] + dc) === v) {
                                list.push([pos[0] + dr, pos[1] + dc]);
                            }
                        });

                        area++;
                        shape.push([pos[0], pos[1]]);
                        M[pos[0]][pos[1]] = '';
                    }
                }

                shape.sort((a, b) => {
                    if (a[0] < b[0]) return -1;
                    else if (a[0] > b[0]) return 1;
                    else return a[1] - b[1];
                });

                let k = 0;
                while(k < shape.length) {
                    let [i, j] = shape[k];
                    while (shape[k]?.[0] === i) {
                        [i, j] = shape[k];

                        if (get(cp, i - 1, j) !== v) {
                            const last = get(cp, i, j - 1);
                            if (last !== v || get(cp, i - 1, j - 1) === v) {
                                sides++;
                            }
                        }

                        if (get(cp, i + 1, j) !== v) {
                            const last = get(cp, i, j - 1);
                            if (last !== v || get(cp, i + 1, j - 1) === v) {
                                sides++;
                            }
                        }

                        k++;
                    }
                }

                console.log(sides);

                shape.sort((a, b) => {
                    if (a[1] < b[1]) return -1;
                    else if (a[1] > b[1]) return 1;
                    else return a[0] - b[0];
                });

                k = 0;
                
                while(k < shape.length) {
                    let sideA = false, sideB = false;
                    let [i, j] = shape[k];
                    console.log('for col', j, k);
                    while (shape[k]?.[1] === j) {
                        [i, j] = shape[k];

                        if (get(cp, i, j - 1) !== v) {
                            const last = get(cp, i - 1, j);
                            if (last !== v || get(cp, i - 1, j - 1) === v) {
                                sides++;
                            }
                        }

                        if (get(cp, i, j + 1) !== v) {
                            const last = get(cp, i - 1, j);
                            if (last !== v || get(cp, i - 1, j + 1) === v) {
                                sides++;
                            }
                        }

                        k++;
                    }

                }

                s += sides * area;
            }
        }
    }

    return s;

}

console.log(alg(parseInput(s)));