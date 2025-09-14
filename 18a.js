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

const W = 71;
const IN = 1024;
function parseInput(str) {
    const M = Array(W).fill().map(() => Array(W).fill('.'));
    const lines = str.split('\n');
    lines.slice(0, IN).forEach((line) => {
        const [i, j] = line.split(',');
        M[i][j] = '#';
    });
    return [M, lines.slice(IN).map(v => v.split(',').map(i => parseInt(i)))];
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

function getCost(M) {
    const row = 0;
    const col = 0;

    const targetRow = W - 1;
    const targetCol = W - 1;

    const cp = M.map(r => r.map(() => Infinity));
    const visited = M.map(r => r.map(() => 0));
    cp[0][0] = 0;

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

    return cp[targetRow][targetCol];    
}

function alg([M, bytes]) {
    // console.log(bytes);
    for (let byte of bytes) {
        M[byte[0]][byte[1]] = '#';
        if (getCost(M) === Infinity) {
            return byte;
        }
    }
    
}

console.log(alg(parseInput(s)));