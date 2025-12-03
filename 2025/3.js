const fs = require('fs');
const s = fs.readFileSync('./input.txt').toString();

function parseInput(str) {
    return str.split('\n').map(v => {
        return v.split('').map(k => +k);
    });
}

function digits(v) {
    if (v === 0) {
        return 1;
    }
    return (Math.log10(v) >>> 0) + 1;
}
function get(M, i, j) {
    return M[i]?.[j] ?? 0;
}
function alg(list) {
    let sum = 0;

    list.forEach((bank, v) => {
        const M = Array(13).fill().map(_ => Array(bank.length).fill(0));
        for (let i = 1; i <= 12; i++) {
            for (let j = i - 1; j < bank.length; j++) {
                M[i][j] = Math.max(get(M, i, j - 1), get(M, i - 1, j - 1)*10 + bank[j]);
            }
        }
        sum += M[M.length - 1][bank.length - 1];
    });
    return sum;
}

console.log(alg(parseInput(s)));