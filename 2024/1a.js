const fs = require('fs');
const s = fs.readFileSync('./input.txt').toString();
// const s = `3   4
// 4   3
// 2   5
// 1   3
// 3   9
// 3   3`;

function parseInput(str) {
    return str.split('\n').map(v => v.split('   '));
}

function alg(list) {
    const M = {};
    const l1 = [];

    list.forEach(([v1, v2]) => {
        M[+v2] = (M[+v2] ?? 0) + 1;
        l1.push(+v1);
    });

    let sum = 0;
    l1.forEach((v) => {
        sum += v * (M[v] ?? 0);
    })

    return sum;

}

console.log(alg(parseInput(s)));