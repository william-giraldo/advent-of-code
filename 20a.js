const fs = require('fs');

const s = fs.readFileSync('./input.txt').toString();
// const s = `5,4
// 4,2
// 4,5
// 3,0
// 2,1
// 6,3
// 2,4
// 1,5
// 0,6
// 3,3
// 2,6
// 5,1
// 1,2
// 5,5
// 2,5
// 6,5
// 1,4
// 0,4
// 6,4
// 1,1
// 6,1
// 1,0
// 0,5
// 1,6
// 2,0`;

function parseInput(str) {
    const M = str.split('\n').map(l => l.split(''));
    return M;
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
]

function mod(v, n) {
    if (v < 0) return n + (v % n);
    return v % n;
}

function getCost(M, row, col) {

    const cp = M.map(r => r.map(() => Infinity));
    const visited = M.map(r => r.map(() => 0));
    cp[row][col] = 0;

    const q = [[row, col]];
    

    let next = q.shift();
    while (next) {

        if(visited[next[0]][next[1]] === 1) {
            next = q.shift();
            continue;
        }

        const cost = cp[next[0]][next[1]];

        // Here, we already know the cost to face in the 'facing' direction
        DIRS.forEach(([dr, dc], dirIx) => {
            if (get(M, next[0] + dr, next[1] + dc) === '.' && get(visited, next[0] + dr, next[1] + dc) === 0) {
                cp[next[0] + dr][next[1] + dc] = Math.min(cp[next[0] + dr][next[1] + dc], cost + 1);
                q.push([next[0] + dr, next[1] + dc]);
            }            
        });

        visited[next[0]][next[1]] = 1;
        next = q.shift();  
    }

    return cp;    
}

function getKey(next) {
    return `${next[0]}-${next[1]}`;
}

const THRESHOLD = 20;
const TARGET = 100; // TO STUDY: Why output varies for 74 pS?
function alg(M) {
    const row = M.findIndex(r => r.includes('S'));
    const col = M[row].indexOf('S');

    const targetRow = M.findIndex(r => r.includes('E'));
    const targetCol = M[targetRow].indexOf('E');
    
    M[row][col] = '.';
    M[targetRow][targetCol] = '.';

    const cstFromS = getCost(M, row, col);
    const cstFromE = getCost(M, targetRow, targetCol);

    const total = cstFromS[targetRow][targetCol] - TARGET;

    let s = 0;
    const cells = new Set();
    for (let i = 0; i < M.length; i++) {
        for (let j = 0; j < M[0].length; j++) {
            if (M[i][j] === '.') {
                for (let k = -THRESHOLD; k <= 0; k++) {
                    for (let w = -(THRESHOLD + k); w <= THRESHOLD + k; w++) {
                        if (get(M, i + k, j + w) === '.') {
                            if (cstFromS[i][j] + cstFromE[i + k][j + w] -k + Math.abs(w) <= total) {
                                cells.add(getKey([i, j]) + ':' + getKey([i + k, j + w]));
                            }
                        }
                    }   
                }

                for (let k = 1; k <= THRESHOLD; k++) {
                    for (let w = -(THRESHOLD - k); w <= THRESHOLD - k; w++) {
                        if (get(M, i + k, j + w) === '.') {
                            if (cstFromS[i][j] + cstFromE[i + k][j + w] + k + Math.abs(w) <= total) {
                                cells.add(getKey([i, j]) + ':' + getKey([i + k, j + w]));
                            }
                        }
                    }   
                }
            }
            // if (M[i][j] === '#') {

            //     if (!DIRS.some(([dr, dc]) => get(M, i + dr, j + dc) === '.')) {
            //         continue;
            //     }


            //     const q = [[i, j, 0]];
            //     let next = q.shift();
            //     const visited = new Set();
                
            //     while (next) {
            //         if (visited.has(getKey(next))) {
            //             next = q.shift();
            //             continue;
            //         }

            //         const cost = next[2];

            //         DIRS.forEach(([dr, dc]) => {
            //             if (get(M, next[0] + dr, next[1] + dc) === '#' 
            //                 && !visited.has(getKey([next[0] + dr, next[1] + dc]))
            //                 && cost + 1 < THRESHOLD - 1) {
            //                 q.push([next[0] + dr, next[1] + dc, cost + 1]);
            //             }            
            //         });

            //         visited.add(getKey(next));

            //         DIRS.forEach(([drO, dcO]) => {
            //             if (get(M, next[0] + drO, next[1] + dcO) === '.') {
            //                 DIRS.forEach(([drI, dcI]) => {
            //                     if (get(M, i + drI, j + dcI) === '.') {
            //                         if (cstFromS[i + drI][j + dcI] + 1 +
            //                             cstFromE[next[0] + drO][next[1] + dcO] + 1 +
            //                             cost <= total
            //                         ) {
            //                             // console.log([i,j],[next[0], next[1]], getKey([i + drI, j + dcI]) + ':' + getKey([next[0] + drO, next[1] + dcO]));
            //                             cells.add(getKey([i + drI, j + dcI]) + ':' + getKey([next[0] + drO, next[1] + dcO]));
            //                         }
            //                     }
            //                 });
            //             }            
            //         });

                    
            //         next = q.shift();
            //     }

            //     // if (get(M, i, j + 1) === '.' && get(M, i, j - 1) === '.') {
            //     //     if (cstFromS[i][j + 1] + 2 + cstFromE[i][j - 1] <= total) {
            //     //         s++;
            //     //     } else if (cstFromS[i][j - 1] + 2 + cstFromE[i][j + 1] <= total) {
            //     //         s++;
            //     //     }
            //     // }

            //     // if (get(M, i + 1, j) === '.' && get(M, i - 1, j) === '.') {
            //     //     if (cstFromS[i + 1][j] + 2 + cstFromE[i - 1][j] <= total) {
            //     //         s++;
            //     //     } else if (cstFromS[i - 1][j] + 2 + cstFromE[i + 1][j] <= total) {
            //     //         s++;
            //     //     }
            //     // }
            // }
        }
    }

    return cells.size;
}

console.log(alg(parseInput(s)));