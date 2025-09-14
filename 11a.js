const fs = require('fs');
const s = fs.readFileSync('./input.txt').toString();
// const s = `125 17`;

const SEPARATOR = ' ';
function parseInput(str) {
    return str.split(SEPARATOR).map(k => parseInt(k));
}

function safe(v) {
    const f = (a, b) => a-b;
    let s = 0;
    if (['' + [...v].sort(f),
        '' + [...v].sort(f).reverse()].includes('' + v)) {
            s += v.every((k, i) => i === 0 || (Math.abs(k - v[i - 1]) > 0 && Math.abs(k - v[i - 1]) <= 3))
                ? 1
                : 0;
        }
    return s;
}

function removeNth(v, n) {
    return v.filter((_, i) => i !== n);
}
function alg(list) {
    let stones = list;
    let zeros = 0, ones = 0; rest = [];

    let M = {};
    stones.forEach((v) => {
        M[v] = (M[v] ?? 0) + 1;
    });

    let i;
    for (i = 0; i<75;i++) {
        const newMap = {};

        Object.keys(M).forEach((k) => {

            if (k === '0') {
                newMap[1] = (newMap[k] ?? 0) + (M[k] ?? 0);
            } else if (k.length % 2 === 0) {
                const a = parseInt(k.substring(0, k.length / 2));
                const b = parseInt(k.substring(k.length / 2));
                
                newMap[a] = (newMap[a] ?? 0) + M[k]

                if (b === 0) {
                    newMap[b] = (newMap[b] ?? 0) + M[k];
                } else {
                    newMap[b] = (newMap[b] ?? 0 ) + M[k]; 
                }
            } else {
                newMap[k*2024] = M[k];
            }

        });
        

        M = newMap;

    }

    console.log(M);

    // console.log(Object.values(M));
    return Object.values(M).reduce((acc, curr) => acc + curr, 0);
    // console.log((new Set(rest)).size);
    // console.log(ones, zeros, rest);
    // return ones + zeros + rest.length;
}

console.log(alg(parseInput(s)));