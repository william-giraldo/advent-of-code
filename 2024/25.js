const fs = require('fs');
const s = fs.readFileSync('./input.txt').toString();

const FN = {
    and(a, b) {
        return a & b;
    },
    or(a, b) {
        return a | b;
    },
    xor(a,b) {
        return a ^ b;
    }
}

function parseInput(str) {
    const locksOrKeys = str.split('\n\n');
    const locks = locksOrKeys.map(l => l.split('\n')).filter(l => l[0] === "#####" && l[6] === ".....");
    const keys = locksOrKeys.map(l => l.split('\n')).filter(l => l[6] === "#####" && l[0] === ".....");

    return [locks, keys];
}

function getHeight(lockOrKey) {
    let ref = [5, 5, 5, 5, 5];
    let diff = -1;

    if (lockOrKey[0] === ".....") { // it is a key
        ref = [0, 0, 0, 0, 0];
        diff = 1;
    }

    for (let row of lockOrKey.slice(1, 6)) {
        let j = 0;
        for (let v of row) {
            if (v === "#") {
                ref[j] += diff;
            }
            j++;
        }
    }

    return ref;
}

function getVal(heights) {
    return heights.reduce((acc, curr) => 5*acc + curr);
}
function alg(locks, keys) {
    locks.sort((a, b) => getVal(getHeight(a)) - getVal(getHeight(b)));
    keys.sort((a, b) => getVal(getHeight(a)) - getVal(getHeight(b)));

    return keys.reduce((acc, key) => {
        const keyHeights = getHeight(key);
        return acc + locks.filter(lock => {
            const lockHeights = getHeight(lock);
            return keyHeights.every((h, i) => lockHeights[i] >= h);
        }).length;
    }, 0);
}

console.log(alg(...parseInput(s)));
