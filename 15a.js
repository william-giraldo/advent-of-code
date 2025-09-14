const fs = require('fs');

const s = fs.readFileSync('./input.txt').toString();
// const s = `###############
// #.......#....S#
// #.#.###.#.###.#
// #.....#.#...#.#
// #.###.#####.#.#
// #.#.#.......#.#
// #.#.#####.###.#
// #...........#.#
// ###.#.#####.#.#
// #...#.....#.#.#
// #.#.#.###.#.#.#
// #.....#...#.#.#
// #.###.#.#.#.#.#
// #E..#.....#...#
// ###############`;

const SEPARATOR = '';
function parseInput(str) {
    let M = str.split('\n');
    return M.map(v => v.split(''));
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

function mod(v, n) {
    if (v < 0) return n + (v % n);
    return v % n;
}

// function roam(W, r, c, f, n) {
//     if (W[r][c] === 'E') return 0;
//     let val = Infinity;
//     DIRS.forEach(([dr, dc], dirIx) => {
//         if ([f, mod(f+1,4), mod(f-1,4)].includes(dirIx)) {
//             if (W[r + dr][c + dc] === n + 1) {
//                 if (dirIx === f) {
//                     val = Math.min(val, 1 + roam(W, r + dr, c + dc, f, n + 1));
//                 } else {
//                     val = Math.min(val, 1001 + roam(W, r + dr, c + dc, dirIx, n + 1));
//                 }
//             }
//         }
//     });

//     return val;
// }

function roam(M, r, c, f, soFar) {
    if (M[r][c] === 'E') return 0;
    if (soFar > 85420) return Infinity;
    let val = Infinity;
    const newVisited = new Set(visited);
    newVisited.add(`${r}-${c}`);
    DIRS.forEach(([dr, dc], dirIx) => {
        if ([f, mod(f+1,4), mod(f-1,4)].includes(dirIx)) {
            if (['.', 'E'].includes(M[r + dr][c + dc]) && !visited.has(`${r + dr}-${c + dc}`)) {
                if (dirIx === f) {
                    val = Math.min(val, 1 + roam(M, r + dr, c + dc, f, newVisited, soFar + 1));
                } else {
                    val = Math.min(val, 1001 + roam(M, r + dr, c + dc, dirIx, newVisited, soFar + 1001));
                }
            }
        }
    });

    return val;
}

function findO(M, pos, dirIx) {
    const dir = DIRS[dirIx];
    let _pos = [pos[0] + dir[0], pos[1] + dir[1]];
    let currChar = M[_pos[0]][_pos[1]];

    while(currChar === '.') {
        _pos = [_pos[0] + dir[0], _pos[1] + dir[1]];
        currChar = get(M, _pos[0], _pos[1]);        
    }

    return currChar === 'O' ? _pos : undefined;
}

function fillOs(M, pos, dirIx) {
    const dir = DIRS[dirIx];
    let _pos = [pos[0] + dir[0], pos[1] + dir[1]];
    let currChar = M[_pos[0]][_pos[1]];

    while(currChar === '.') {
        M[_pos[0]][_pos[1]] = 'O';
        _pos = [_pos[0] + dir[0], _pos[1] + dir[1]];
        currChar = get(M, _pos[0], _pos[1]);        
    }
}

function alg(M) {
    const row = M.findIndex(r => r.includes('S'));
    const col = M[row].indexOf('S');

    const targetRow = M.findIndex(r => r.includes('E'));
    const targetCol = M[targetRow].indexOf('E');

    const costsS = getCosts(M, 3);
    const minCost = Math.min(...costsS[targetRow][targetCol]);

    M[row][col] = 'E';
    M[targetRow][targetCol] = 'S';

    const costsE = getCosts(M, 2);

    let s = 0;
    for(let i=0; i<M.length; i++) {
        for (let j = 0; j<M[0].length; j++) {
            let add = false;
            DIRS.forEach((_, dirIx) => {
                add = add || (costsS[i][j][dirIx] + costsE[i][j][mod(dirIx - 2, 4)] === minCost);
            });
            if (add) {
                s++;
            }
        }
    }

    return s;

}

function getCosts(M, startFacing) {
    const row = M.findIndex(r => r.includes('S'));
    const col = M[row].indexOf('S');

    const targetRow = M.findIndex(r => r.includes('E'));
    const targetCol = M[targetRow].indexOf('E');

    // return roam(M, row, col, 3, new Set(), 0);

    const cp = M.map(r => r.map(v => [Infinity, Infinity, Infinity, Infinity]));
    const visited = M.map(r => r.map(v => [0,0,0,0]));

    // cp[row][col] = [1000, Infinity, 1000, 0];
    // const q = [[row, col, 3]];


    cp[row][col] = DIRS.map((_, ix) => {
        if (startFacing === ix) {
            return 0;
        } else if (mod(ix - startFacing, 4) === 1 || mod(startFacing - ix, 4) === 1) {
            return 1000;
        }
        return Infinity;
    });

    const q = [[row, col, startFacing]];
    

    let next = q.shift();
    while (next) {

        const facing = next[2];

        if(visited[next[0]][next[1]][facing]) {
            next = q.shift();
            continue;
        }

        const costs = cp[next[0]][next[1]];

        // Here, we already know the cost to face in the 'facing' direction
        DIRS.forEach(([dr, dc], dirIx) => {
            if ([facing, mod(facing+1,4), mod(facing-1,4)].includes(dirIx)) {
                
                if (!visited[next[0]][next[1]][dirIx] && dirIx !== facing) {
                    cp[next[0]][next[1]][dirIx] = Math.min(cp[next[0]][next[1]][dirIx], cp[next[0]][next[1]][facing] + 1000);
                    q.push([next[0], next[1], dirIx]);
                }

                if (!['S', '.', 'E'].includes(M[next[0] + dr][next[1] + dc])) {
                    return;
                }

                const visitedArr = get(visited, next[0] + dr, next[1] + dc);
                if (visitedArr[dirIx] === 0) {
                    const cstnext = cp[next[0] + dr][next[1] + dc][dirIx];
                    if (dirIx === facing) {
                        if (costs[facing] + 1 < cstnext) {
                            cp[next[0] + dr][next[1] + dc][facing] = costs[facing] + 1;
                        }
                    } else {
                        if (costs[facing] + 1001 < cstnext) {
                            cp[next[0] + dr][next[1] + dc][dirIx] = costs[facing] + 1001;
                        }
                    }
                    q.push([next[0] + dr, next[1] + dc, dirIx]);
                }
            }
            
        });

        visited[next[0]][next[1]][facing] = 1;
        q.sort(([ar, ac, af], [br, bc, bf]) => cp[ar][ac][af] - cp[br][bc][bf]);

        next = q.shift();  
    }

    return cp;

    // return cp.map(r => r.map(v => v.join(',')).join(';')).join('\n');

    // let next = q.shift();
    // while (next) {

    //     if(visited[next[0]][next[1]]) {
    //         next = q.shift();
    //         continue;
    //     }

    //     const cost = cp[next[0]][next[1]];
    //     const facing = M[next[0]][next[1]];
    //     DIRS.forEach(([dr, dc], dirIx) => {
    //         if ([facing, mod(facing+1,4), mod(facing-1,4)].includes(dirIx)) {
    //             const val = get(visited, next[0] + dr, next[1] + dc);
    //             if (val === 0) {
    //                 const cstnext = get(cp, next[0] + dr, next[1] + dc);
    //                 if (dirIx === facing) {
    //                     if (cost + 1 < cstnext) {
    //                         cp[next[0] + dr][next[1] + dc] = cost + 1;
    //                         M[next[0] + dr][next[1] + dc] = facing;
    //                     }
    //                 } else {
    //                     if (cost + 1001 < cstnext) {
    //                         cp[next[0] + dr][next[1] + dc] = cost + 1001;
    //                         M[next[0] + dr][next[1] + dc] = dirIx;
    //                     }
    //                 }
    //                 q.push([next[0] + dr, next[1] + dc]);
    //             }
    //         }
            
    //     });

    //     visited[next[0]][next[1]] = 1;
    //     q.sort(([ar, ac], [br, bc]) => cp[ar][ac] - cp[br][bc]);
    //     next = q.shift();  
    // }
    
}

console.log(alg(parseInput(s)));