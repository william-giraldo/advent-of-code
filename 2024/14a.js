const fs = require('fs');
// const s = fs.readFileSync('./input.txt').toString();

const s = `p=0,4 v=3,-3
p=6,3 v=-1,-3
p=10,3 v=-1,2
p=2,0 v=2,-1
p=0,0 v=1,3
p=3,0 v=-2,-2
p=7,6 v=-1,-3
p=3,0 v=-1,-2
p=9,3 v=2,3
p=7,3 v=-1,2
p=2,4 v=2,-3
p=9,5 v=-3,-3`;


function parseInput(str) {
    return str.split('\n').filter(Boolean).map(v => {
        const rStr = /p=(-?\d+),(-?\d+) v=(-?\d+),(-?\d+)/g;

        return [...v.matchAll(rStr)][0].slice(1).map(v => parseInt(v));
    });
}

function toStr(M) {
    return M.map(v => v.map(a => a ? a : '.').join('')).join('\n');
}

function get(M, i, j) {
    return M[i]?.[j];
}

// const WIDTH = 101, HEIGHT = 103;
const WIDTH = 11, HEIGHT = 7;
const HALF_W = (WIDTH - 1) / 2;
const HALF_H = (HEIGHT - 1) / 2;

function mod(v, n) {
    if (v < 0) return n + (v % n);
    return v % n;
}

function alg(list) {

    let M;
    for (let i = 0; true; i++) {
        M = Array(HEIGHT).fill().map(() => Array(WIDTH).fill(0));
        for (let robot of list) {
            const [px, py, vx, vy] = robot;
            robot[0] = mod(px + vx, WIDTH);
            robot[1] = mod(py + vy, HEIGHT);

            M[robot[1]][robot[0]] = 'X';
        }

        for (let robot of list) {
            const [px, py] = robot;
            let is = true;
            for (let k = 0; k < 3; k++) {
                for (let w = px - k; w <= px + k; w++) {
                    is = is && !!get(M, py + k, w);
                }
            }
            if (is ) {
                console.log(i);
                return toStr(M);
            }
        }
    }

    // return toStr(M);


    // list.forEach(([px, py]) => {
    //     if (py < HALF_H) {
    //         if (px < HALF_W) {
    //             q0++;
    //         } else if (px > HALF_W) {
    //             q1++;
    //         }
    //     }

    //     if (py > HALF_H) {
    //         if (px < HALF_W) {
    //             q2++;
    //         } else if (px > HALF_W) {
    //             q3++;
    //         }
    //     }
    // });

    // return q0*q1*q2*q3;
}

console.log(alg(parseInput(s)));