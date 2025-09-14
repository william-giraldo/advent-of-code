const fs = require('fs');
const s = fs.readFileSync('./input.txt').toString();
// const s = `3   4
// 4   3
// 2   5
// 1   3
// 3   9
// 3   3`;

function parseInput(str) {
    return str.split('\n');
}
const NUMERIC_KEYPAD = {
    7: [0, 0],
    8: [0, 1],
    9: [0, 2],
    4: [1, 0],
    5: [1, 1],
    6: [1, 2],
    1: [2, 0],
    2: [2, 1],
    3: [2, 2],
    0: [3, 1],
    A: [3, 2]
};

const PRECOMPUTED = {
    'A-^': '<',
    'A->': 'v',
    'A-v': '<v', // Change this
    'A-<': 'v<<',
    '^-A': '>',
    '^->': 'v>',
    '^-v': 'v',
    '^-<': 'v<',
    '>-A': '^',
    '>-^': '^<',
    '>-v': '<',
    '>-<': '<<',
    'v-A': '^>',
    'v-^': '^',
    'v->': '>',
    'v-<': '<',
    '<-A': '>>^' ,
    '<-^': '>^',
    '<->': '>>',
    '<-v': '>'
};

function getPathsForNumeric(str, startPos) {
    const next = str[0];
    if (!next) {
        return [''];
    }

    if (startPos[0] === 3 && startPos[1] === 0) return [];

    const endPos = NUMERIC_KEYPAD[next];

    if (endPos[0] === startPos[0] && endPos[1] === startPos[1]) {
        return getPathsForNumeric(str.slice(1), endPos).map(p => 'A' + p);
    } else if (endPos[0] === startPos[0]) {
        const P = Array(Math.abs(endPos[1] - startPos[1])).fill(endPos[1] > startPos[1] ? '>' : '<').concat(['A']).join('');
        return getPathsForNumeric(str.slice(1), endPos).map(p => P + p);
    } else if (endPos[1] === startPos[1]) {
        const P = Array(Math.abs(endPos[0] - startPos[0])).fill(endPos[0] > startPos[0] ? 'v' : '^').concat(['A']).join('');
        return getPathsForNumeric(str.slice(1), endPos).map(p => P + p);
    } else {
        const ver = getPathsForNumeric(str, [startPos[0] > endPos[0] ? startPos[0] - 1 : startPos[0] + 1,  startPos[1]])
        const hor = getPathsForNumeric(str, [startPos[0], startPos[1] > endPos[1] ? startPos[1] - 1 : startPos[1] + 1]);
        
        return ver.map(p => (startPos[0] > endPos[0] ? '^' : 'v') + p).concat(
            hor.map(p => (startPos[1] > endPos[1] ? '<' : '>') + p)
        );
    }
}

// function getPathsForKeypad(str, startPos) {
//     let paths = [''];
//     for (let c of str) {
//         if (startPos === c) {
//             paths = paths.map(p => p + 'A');
//         } else {
//             const pc = PRECOMPUTED[`${startPos}-${c}`];
//             if (!pc) {
//                 throw new Error(`Entry not found for ${startPos} - ${c}`);
//             }

//             paths = paths.map((p) => pc.map(pre => p + pre + 'A')).flat();
//         }
//         startPos = c;
        
//     }
//     return paths;
// }

function getPathsForKeypad(str, startPos) {
    let path = '';
    for (let c of str) {
        if (startPos === c) {
            path += 'A';
        } else {
            const pc = PRECOMPUTED[`${startPos}-${c}`];
            if (!pc) {
                throw new Error(`Entry not found for ${startPos} - ${c}`);
            }

            path += pc + 'A';
        }
        startPos = c;
        
    }
    return path;
}

const NUM_KEYPADS = 3;
function alg(codes) {
    const target = Math.ceil(NUM_KEYPADS / 2);
    const symbols = '<>^vA';

    const pre = [];
    for (let i = 0; i < target; i++) {
        const O = {};
        for (let s1 of symbols) {
            for (let s2 of symbols) {
                if (i === 0) {
                    O[`${s1}-${s2}`] = getPathsForKeypad(s2, s1);
                } else {
                    O[`${s1}-${s2}`] = getPathsForKeypad(pre[i - 1][`${s1}-${s2}`], 'A');
                }
            }
        }
        pre.push(O);
    }

    const left = pre[target - 1];
    const right = pre[NUM_KEYPADS - target - 1];

    let s = 0;
    codes = ['029A'];
    for (let code of codes) {
        const paths = [
            'v'
            //getPathsForNumeric(code, [3, 2])[0]
        ];

        console.log(paths);
        let sa = Infinity;
        paths.forEach((path) => {
            let s1 = 0;
            let last1 = 'A';
            let val = '';
            for (let c1 of path) {
                let last2 = 'A';
                for (let c2 of left[`${last1}-${c1}`]) {
                    s1 += right[`${last2}-${c2}`].length;
                    val += right[`${last2}-${c2}`];
                    last2 = c2;
                }
                last1 = c1;
            }
            sa = Math.min(sa, s1);

            for (let k = 0; k < NUM_KEYPADS; k++) {
                path = getPathsForKeypad(path, 'A');
                console.log(path);
            }
            
        });
        s = sa;
        // s += code.split('').filter(v => /\d/.test(v)).join('') * sa;
    }
    
    
    return s;
}


console.log(alg(parseInput(s)));