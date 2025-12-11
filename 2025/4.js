const fs = require('fs');
const s = fs.readFileSync('./input.txt').toString();

function parseInput(str) {
    return str.split('\n').map(v => {
        return v.split('');
    });
}

function digits(v) {
    if (v === 0) {
        return 1;
    }
    return (Math.log10(v) >>> 0) + 1;
}
function get(M, i, j) {
    return M[i]?.[j];
}
function alg(M) {
    let tR = [];
    for (let i = 0; i < M.length; i++) {
        for (let j = 0; j < M[0].length; j++) {
            if (M[i][j] === '.') {
                continue;
            }

            let s = 0;
            for (let k = -1; k <= 1; k++) {
                for (let l = -1; l <= 1; l++) {
                    if (k == 0 && l == 0) {
                        continue;
                    }

                    if (get(M, i + k, j + l) === "@") {
                        s += 1;
                    }
                }    
            }

            if (s < 4) {
                tR.push([i, j]);
            }
        }
    }

    return tR;
}

const M = parseInput(s);
let sum = 0;
for (let tR = alg(M); tR.length > 0; tR = alg(M)) {
    sum += tR.length;
    tR.forEach(([i, j]) => {
        M[i][j] = '.';
    });
}
console.log(sum);