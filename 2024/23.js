const fs = require('fs');
const s = fs.readFileSync('./input.txt').toString();

function parseInput(str) {
    return str.split('\n').map(l => l.split('-'));
}

const REL = {};

/**
 * 
 * @param {Array<Array<string>>} rels 
 */
function alg(rels) {
    
    const tStarting = new Set();
    let sets = [];
    rels.forEach(([left, right]) => {
        REL[left] = REL[left] ?? new Set();
        REL[left].add(right);
        REL[right] = REL[right] ?? new Set();
        REL[right].add(left);

        if (left.toLowerCase()[0] === 't') {
            tStarting.add(left);
        }

        if (right.toLowerCase()[0] === 't') {
            tStarting.add(right);
        }

        sets.push([left, right]);
    });


    const nodes = Object.keys(REL);
    nodes.sort((n1, n2) => REL[n2].size - REL[n1].size)

    let maxSoFar = [];
    for (let n of nodes) {
        const siblings = [...REL[n]];
        const characteristics = siblings.map((sibl) => {
            return siblings.reduce((acc, curr, i) => REL[sibl].has(curr) || curr === sibl ? acc + (1 << i) : acc, 0);
        });

        const maxNetwork = (1 << siblings.length) - 1;
        
        for (let network = maxNetwork; network > 0; network--) {
            const relevantCharacteristics = characteristics.filter((_, i) => (network & (1 << i)) !== 0)
            if (relevantCharacteristics.every(chr => (chr & network) === network)) {
                if (relevantCharacteristics.length + 1 > maxSoFar.length) {
                    maxSoFar = siblings.filter((_, i) => (network & (1 << i)) !== 0).concat([n]);
                    if (maxSoFar === siblings.length + 1) {
                        return maxSoFar;
                    }
                }
            }            
        }
    }

    return maxSoFar;


}

console.log(alg(parseInput(s)).sort().join(','));
