const fs = require('fs');
const s = fs.readFileSync('./input.txt').toString();
// const s = `47|53
// 97|13
// 97|61
// 97|47
// 75|29
// 61|13
// 75|53
// 29|13
// 97|29
// 53|29
// 61|53
// 97|53
// 61|29
// 47|13
// 75|47
// 97|75
// 47|61
// 75|61
// 47|29
// 75|13
// 53|13

// 75,47,61,53,29
// 97,61,53,29,13
// 75,29,13
// 75,97,47,61,53
// 61,13,29
// 97,13,75,29,47`;

const SEPARATOR = ' ';
function parseInput(str) {
    const [pages, updates] = str.split('\n\n');
    return [pages.split('\n').map(v => v.split('|').map(v => parseInt(v))),
        updates.split('\n').map(v => v.split(',').map(v => parseInt(v)))];
}

function buildOrderedMap(pages) {
    const O = {};
    pages.forEach(([left, right]) => {
        O[right] = (O[right] ?? []).concat([left]);
        O[left] = (O[left] ?? []);
    });
    return O;
}

function removeNth(v, n) {
    return v.filter((_, i) => i !== n);
}
function alg([pages, updates]) {
    
    const M = buildOrderedMap(pages);

    let s = 0;
    updates.forEach((pages) => {
        if (!pages.every((p, i) => {
            return i === 0 || M[p].includes(pages[i-1]);
        })) {
            let i;
            for (i = 0; i <= (pages.length - 1)/2; i++) {
                const idx = pages.findIndex((p, k) => {
                    if (k < i) {
                        return false;
                    }

                    return pages.every((_p, w) => {
                        if (w < i || _p === p) {
                            return true;
                        }
    
                        return M[_p].includes(p);
                    });
                });
                const swap = pages[idx];
                pages[idx] = pages[i];
                pages[i] = swap;
            }
            s += pages[i-1];
        }
    })
    return s;
}

console.log(alg(parseInput(s)));