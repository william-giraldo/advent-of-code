const fs = require('fs');
const s = fs.readFileSync('./input.txt').toString();
// const s = `190: 19 0`
// const s = `190: 10 19
// 3267: 81 40 27
// 83: 17 5
// 156: 15 6
// 7290: 6 8 6 15
// 161011: 16 10 13
// 192: 17 8 14
// 21037: 9 7 18 13
// 292: 11 6 16 20`;

const SEPARATOR = ':';
function parseInput(str) {
    return str.split('\n').filter(Boolean).map(v => {
        const [left, right] = v.split(':');
        return [parseInt(left), ...right.trim().split(/\s+/).map(v => parseInt(v))];
    });
}

function recurse(values, target, carry) {
    if (values.length === 1) {
        return [carry + values[0], carry * values[0], parseInt(`${carry}${values[0]}`)].includes(target);
    }

    const [next, ...rest] = values;
    return recurse(rest, target, carry + next) || recurse(rest, target, carry * next) || recurse(rest, target, parseInt(`${carry}${next}`));
}

function alg(list) {
    console.log(list);
    return list.filter(([target, first, ...rest]) => {
        return recurse(rest, target, first);
    }).reduce((acc, [v]) => acc + v, 0);
}

console.log(alg(parseInput(s)));