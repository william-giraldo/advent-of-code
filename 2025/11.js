const fs = require('fs');
const s = fs.readFileSync('./input.txt').toString();

function parseInput(str) {
    const O = {};
    str.split('\n').map(l => {
        const [left, right] = l.split(':');
        O[left] = right.trim().split(' ').map(n => {
                // return { pos: n, fft: n === 'fft', dac: n === 'dac', m: 0 };
                return n;
        });
    });

    return O
}

function ways(O, start, end) {
    let paths = O[start].map(n => ({ pos: n, m: 1 }));
    
    let ws = 0;
    while(paths.length) {
        const newPaths = [];
        paths.forEach((p) => {
            if (p.pos !== end && p.pos !== 'out') {
                newPaths.push(...O[p.pos].map(n => ({ pos: n, m: p.m })));
            } else if (p.pos === end) {
                ws += p.m;
            }
        });

        const M = {};
        for (let path of newPaths) {
            if (M[path.pos]) {
                M[path.pos].m += path.m;
            } else {
                M[path.pos] = path;
            }
        }
        paths = Object.values(M);
    }

    return ws;
    
}

function alg(O) {
    return ways(O, 'svr', 'fft')
         *ways(O, 'fft', 'dac')
         *ways(O, 'dac', 'out');
}

console.log(alg(parseInput(s)));