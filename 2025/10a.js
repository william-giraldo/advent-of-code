const fs = require('fs');
const s = fs.readFileSync('./input.txt').toString();

function parseInput(str) {
    const lines = str.split('\n');
    return lines.map(line => {
        const [desired, ...buttons] = line.split(' ')
        // return [desired, buttons];
        buttons.pop()
        return [
            desired.replace('\[', '').replace('\]', '').split(''),
            buttons.map(b => b.replace('(', '').replace(')', '').split(',').map(v => +v))
        ] 

    })
       
}

function countOnes(num) {
    let ones = 0;
    while (num > 0) {
        ones += num % 2;
        num = num >> 1;
    }
}

function alg(lines) {
    let sum = 0;
    lines.forEach(([desired, buttons]) => {
        let combinations = 2**buttons.length - 1;
        buttons = buttons.map(bArray => bArray.reduce((acc, curr) => acc + (1 << curr), 0))
        const des = +('0b' + desired.map(v => v === '.' ? 0 : 1).reverse().join(''));
        
        let minToggles = Infinity;
        for (let i = 1; i <= combinations; i++) {
            let toggles = 0;
            let res = 0;
            let j = i;
            let pos = 0;
            while (j > 0) {
                if (j % 2) {
                    res = res ^ buttons[pos];
                    toggles++;
                }
                j = j >> 1;
                pos++;
            }
            if (res === des) {
                minToggles = Math.min(minToggles, toggles);
            }
        }

        sum += minToggles;
    });
    return sum;
}

console.log(alg(parseInput(s)));