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
    const [values, rels] = str.split('\n\n');
    const knownVals = {};
    values.split('\n').forEach(v => {
        const [node, val] = v.split(':');
        knownVals[node] = +val;
    });

    const knownRels = {};
    rels.split('\n').forEach(rel => {
        const re = /^(.{3})\s(.*?)\s(.{3})\s->\s(.{3})$/;
        const [_, left, op, right, result] = rel.match(re);
        knownRels[result] = {left, op: op.toLowerCase(), right};
    });

    return [knownVals, knownRels];

}

function compute(node, rels, vals) {
    if (node in vals) {
        return vals[node];
    }

    const { left, op, right } = rels[node];
    const res = FN[op](compute(left, rels, vals), compute(right, rels, vals));
    // return vals[node] = res;
    return res;
}

function key(prefix, i) {
    return `${prefix}${i < 10 ? '0' + i : i}`;
}

function getSignal(M, a, b, op) {
    return M[`${a}-${op}-${b}`] ?? M[`${b}-${op}-${a}`];
}

function alg(vals, rels) {

    /**
     * Conventions:
     * Let x, y be the bits in the input, w be the carry, z the output. k the output carry.
     * Then, on a non-swapped full adder
     * a = x XOR y
     * b = a AND w
     * c = x AND y
     * z = a AND w
     * k = b OR c
     */
    const M = {};
    Object.entries(rels).forEach(([sName, gate]) => {
        const { left: a, right: b, op } = gate;
        M[`${a}-${op}-${b}`] = M[`${b}-${op}-${a}`] = sName;
    });

    let carry = M[`x00-and-y00`];
    const swapped = [];
    for (let i = 1; i <= 44; i++) {
        const a = getSignal(M, key('x', i), key('y', i), 'xor');
        const c = getSignal(M, key('x', i), key('y', i), 'and');

        const zKey = key('z', i);
        const zOp = rels[zKey].op;
        if (zOp !== 'xor') {
            // Z was swapped

            const z = getSignal(M, a, carry, 'xor') // "the other"
            const b = getSignal(M, a, carry, 'and')

            swapped.push(zKey, z);
            const { op } = rels[zKey];
            if (op === 'or') {
                // swapped with K
                carry = z;
            } else if (op === 'and') {
                if (b === zKey) {
                    carry = getSignal(M, z, c, 'or');
                } else if (c === zKey) {
                    carry = getSignal(M, z, b, 'or');
                } else {
                    throw new Error(`Wtf happens at i=${i}. op for ${zKey} was and, but b=${b} and c=${c}`);
                }
            } else {
                throw new Error(`Wtf happens at i=${i}. op for ${zKey} was ${op}`);
            }
        } else if ([rels[zKey].left, rels[zKey].right].includes(c)) { // Z wasn't swapped
            const b = getSignal(M, c, carry, 'and')
            carry = getSignal(M, b, a, 'or');
            swapped.push(a, c);
        } else { // no swaps
            const b = getSignal(M, a, carry, 'and')
            carry = getSignal(M, b, c, 'or');
        }
    }
    return swapped.sort().join(',');
}
console.log(alg(...parseInput(s)));
