const fs = require('fs');
const s = fs.readFileSync('./input.txt').toString();

function parseInput(str) {
    return str.split('\n').map(v => {
        const [dir, ...rest] = v.split('');
        return [dir, +rest.join('')];
    });
}

function mod(v, n) {
    if (v < 0) return (n + (v % n)) % n;
    return v % n;
}

function alg(list) {
    let initial = 50;
    let times = 0;
    list.forEach(([dir, amount]) => {
        // console.log(dir === 'L' ? mod(initial - amount, 100) : mod(initial + amount, 100))
        // initial = dir === 'L' ? mod(initial-amount, 100) : mod(initial+amount, 100)

        amount = (dir === 'L' ? -amount : amount);
        const hundreds = (amount / 100) >> 0;
        times += Math.abs(hundreds);
        const left = amount - 100*hundreds;
        
        if ((initial + left >= 100) || (initial + left <= 0)) {
            if (initial != 0)
                times++;
        }
        initial = mod(initial + left, 100);
    });
    return times;
}

console.log(alg(parseInput(s)));