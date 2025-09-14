const fs = require('fs');
const s = fs.readFileSync('./input.txt').toString();

// const s = `Register A: 729
// Register B: 0
// Register C: 0

// Program: 0,1,5,4,3,0`;

const SEPARATOR = ':';
function parseInput(str) {
    const rStr = `Register A: (\\d+)
Register B: (\\d+)
Register C: (\\d+)

Program: (.*$)`;
    return [...str.matchAll(new RegExp(rStr, 'g'))][0].slice(1).map((v, i) => i < 3 ? BigInt(v) : v.split(',').map(v => BigInt(v)));
}

let A, B, C, IP;

function getCombo(op) {
    if (op >= 0n && op <= 3n) {
        return op;
    }
    return [A, B, C][op - 4n];
}

let stdout = [];
const FN = [
    (op) => A = A / (2n ** getCombo(op)), // 0
    (op) => B = B ^ op, // 1
    (op) => B = getCombo(op) % 8n, // 2
    (op) => A !== 0n && (IP = op), // 3
    (op) => B = B ^ C, // 4
    (op) => stdout.push(getCombo(op) % 8n),
    (op) => B = A / (2n ** getCombo(op)),
    (op) => C = A / (2n ** getCombo(op)), // 7
]
function run(list, i) {
    stdout = [];
    let program;
    [A, B, C, program] = list;
    IP = 0n;


    FN[program[IP]](program[IP + 1n]);
    IP += 2n;

    const length = BigInt(program.length);
    while(IP < length) {

        const lastIP = IP;
        FN[program[IP]](program[IP + 1n]);
        if (program[lastIP] !== 3n || A === 0n) {
            IP += 2n;
        }   
    }
    return stdout;
}

let found = false;
function find (i, a, program) {
    for (let r = 0n; r < 8n && !found; r++) {
        if (`${run([8n*a + r, 0n, 0n, program])}` === `${program.slice(i)}`) {
            if (i === 0) {
                console.log('final value is', 8n*a + r);
                found = true
            } else {
                find(i - 1, 8n*a + r, program);
            }
        }
    }
}

function alg(list) {
    const [initA, initB, initC, program] = list;

    find(15, 0n, program);

}

console.log(alg(parseInput(s)));