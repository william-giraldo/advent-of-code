const fs = require('fs');
const s = fs.readFileSync('./input.txt').toString();

function parseInput(str) {
    const lines = str.split('\n');
        // .map(l => l.split(''));
    const cols = [];

    while(lines.every(l => !!l.length)) {
        const indexes = lines.map(l => l.indexOf(' '));
        const ptr = Math.max(...indexes);
        cols.push(lines.map(l => l.substr(0, ptr)));
        lines.forEach((l, i) => (lines[i] = l.substr(ptr + 1)));
    }
    return cols;

}

function digits(v) {
    if (v === 0) {
        return 1;
    }
    return (Math.log10(v) >>> 0) + 1;
}
function get(M, i, j) {
    return M[i]?.[j];
}

function overlaps(a, b) {
    return b[0] <= a[1] && b[1] >= a[0];
}
function assert(predicate) {
    if (!predicate()) {
        throw new Error("Assertion failed", predicate.toString());
    }
}
function alg(cols) {
    
    let total = 0;
    cols.forEach((col) => {
        const op = col.pop();
        const res = []
        const span = Math.max(...col.map(c => c.length));

        for (let i = span - 1; i >= 0; i--) {
            res.push(col.map(row => row[i]).join(''));
        }

        total += eval(res.join(op));
    });

    return total;
    
}

console.log(alg(parseInput(s)));