const fs = require('fs');
const s = fs.readFileSync('./input.txt').toString();

function parseInput(str) {
    return str.split(',').map(v => {
        return v.split('-').map(k => +k);
    });
}

function digits(v) {
    if (v === 0) {
        return 1;
    }
    return (Math.log10(v) >>> 0) + 1;
}

function alg(list) {
    let s = new Set();

    list.forEach(([left, right]) => {

        for (let k = 2; k <= digits(right); k++) {
                // for (let k = 2; k <= 2; k++) {

            let nLeft = left;
            let nRight = right;
            if (digits(nLeft) % k) {
                nLeft = 10 ** (k*Math.ceil(digits(nLeft)/k) - 1);
            }

            if (digits(nRight) % k) {
                nRight = 10**(k*Math.floor(digits(nRight)/k)) - 1;
            }

            if (nLeft > nRight) {
                continue;
            }

            const msb_power = (10**(digits(nLeft) / k));
            const left_msb = (nLeft/(msb_power**(k-1))) >> 0;
            const right_msb = (nRight/(msb_power**(k-1))) >> 0;

            for (let i = left_msb; i < right_msb; i++) {
                let num = 0;
                for (let j = 0; j < k; j++) {
                    num *= msb_power;
                    num += i;
                }

                if (num >= left) {
                    s.add(num);
                }
            }

            let num = 0;
            for (let j = 0; j < k; j++) {
                num *= msb_power;
                num += right_msb;
            }

            if (num <= right && num >= left) {
                s.add(num);
            }

        }
    });
    let sum = 0;
    s.forEach(v => sum += v);
    return sum;
}

console.log(alg(parseInput(s)));
// console.log(alg([[1,17]]));