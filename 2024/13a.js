const fs = require('fs');
const s = fs.readFileSync('./input.txt').toString();

// const s = `Button A: X+94, Y+34
// Button B: X+22, Y+67
// Prize: X=8400, Y=5400

// Button A: X+26, Y+66
// Button B: X+67, Y+21
// Prize: X=12748, Y=12176

// Button A: X+17, Y+86
// Button B: X+84, Y+37
// Prize: X=7870, Y=6450

// Button A: X+69, Y+23
// Button B: X+27, Y+71
// Prize: X=18641, Y=10279`;

const SEPARATOR = ':';
function parseInput(str) {
    return str.split('\n\n').filter(Boolean).map(v => {
        const rStr = `Button A: X\\+(\\d+), Y\\+(\\d+)
Button B: X\\+(\\d+), Y\\+(\\d+)
Prize: X=(\\d+), Y=(\\d+)`;

        return [...v.matchAll(new RegExp(rStr, 'g'))][0].slice(1).map(v => parseInt(v));
    });
}

function toStr(M) {
    return M.map(v => v.map(k => k === Infinity ? 'X' : k).join('')).join('\n');
}

function get(M, i, j) {
    return M[i]?.[j] ?? Infinity;
}

const APRICE = 3;
const BPRICE = 1;


function alg(list) {
    let tokens = 0;
    list.forEach((entry, i) => {
        // console.log('parsing entry', i + 1);
        let [ax, ay, bx, by, px, py] = entry;
        px += 10000000000000;
        py += 10000000000000;

        const den = (ax*by - ay*bx);
        if (den !== 0) {
            const x = (by*px - bx*py)/den;
            const y = (ay*px - ax*py)/(-den);
            if (Number.isInteger(x) && Number.isInteger(y)) {
                tokens += APRICE*x + BPRICE*y;
            }
        }

        
        
        // if (M[px][py] !== Infinity) {
        //     tokens += M[px][py];
        // }

    });

    return tokens;


}

console.log(alg(parseInput(s)));