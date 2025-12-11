const fs = require('fs');
const s = fs.readFileSync('./input.txt').toString();

let N = 0
function parseInput(str) {
    const M = str.split('\n').map(l => l.split(',').map(v => +v));
    N = M.length;
    return M
}

function mod(v, n) {
    if (v < 0) return (n + (v % n)) % n;
    return v % n;
}

function allToCorrectSide(M, n1, n2) {
    const a = M[n1];
    const b = M[n2];

    if (a[0] === b[0] || a[1] === b[1]) {
        return false;
    }

    if (b[1] > a[1]) { // vertices 1 or 2
        const left = Math.min(a[0], b[0]);
        const [y1, y2] = [a[1], b[1]];
        n1 = mod(n1 - 1, N);
        let toReturn = true;
        while(n1 !== n2 && toReturn) {
            toReturn = M[n1][0] <= left || (M[n1][1] >= y2 || M[n1][1] <= y1);
            n1 = mod(n1 - 1, N);
        }
        return toReturn;
    } else { // vertices 3 or 4
        const top = Math.min(a[1], b[1]);
    }
}

function alg(M) {
    let A = 0;
    const xCoords =  M.map(([x]) => x);
    const leftmost = Math.min(...xCoords);

    const yCoords = M.map(([_, y]) => y);
    const bottommost = Math.min(...yCoords);
    const topmost = Math.max(...yCoords);

    const [bottomIx, topIx] = [M.findIndex(([x, y]) => bottommost === y), M.findIndex(([x, y]) => topmost === y)];
    
    // It is anti-clockwise

    console.log(bottomIx, topIx, M[bottomIx], M[topIx]);
    for (let i = 0; i < M.length; i++) {
        for (let j = i; j < M.length; j++){
            const a = M[i];
            const b = M[j];

            if (a[0] === b[0] || a[1] === b[1]) {
                continue;
            }


            const top = Math.max(a[1], b[1]);
            const left = Math.min(a[0], b[0]);
            const bottom = Math.min(a[1], b[1]);
            const right = Math.max(a[0], b[0]);


            let valid = true;

            let n1;
            for (n1 = topIx; n1 != bottomIx && valid; n1 = mod(n1 + 1, N)) {
                valid = (n1 === i || n1 === j) || M[n1][0] <= left || (M[n1][1] >= top || M[n1][1] >= bottom);
            }

            valid = valid && ((n1 === i || n1 === j) || M[n1][0] <= left || (M[n1][1] >= top || M[n1][1] <= bottom));

            for (n1 = bottomIx; n1 != topIx && valid; n1 = mod(n1 + 1, N)) {
                valid = (n1 === i || n1 === j) || M[n1][0] >= right || (M[n1][1] >= top || M[n1][1] <= bottom);
            }

            valid = valid && ((n1 === i || n1 === j) || M[n1][0] >= right || (M[n1][1] >= top || M[n1][1] <= bottom));


            if (valid) {
                const newA = (1 + top - bottom) * (1 + right - left);
                if (newA > A) {
                    // console.log(M[i], M[j], newA);
                }
                A = Math.max(A, newA);
            }
        }
    }
    return A;
}

console.log(alg(parseInput(s)));