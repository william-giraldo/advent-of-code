const fs = require('fs');
const s = fs.readFileSync('./input.txt').toString();
// const s = `r, wr, b, g, bwu, rb, gb, br

// brwrr
// bggr
// gbbr
// rrbgbr
// ubwu
// bwurrg
// brgr
// bbrgwb`;
const SEPARATOR = ' ';
function parseInput(str) {
    const [towels, strings] = str.split('\n\n');
    return [towels.split(', '), strings.split('\n')];
}

function alg([towels, strings]) {
    let n = 0;
    const S = new Set(towels);
    strings.forEach((str) => {
        const dp = Array(str.length + 1).fill(false);
        dp[0] = 1;
        for (let i = 1; i < str.length + 1; i++) {
            let numWays = 0;
            for (let j = 0; j < i; j++) {
                if (dp[j] > 0 && S.has(str.slice(j, i))) {
                    numWays += dp[j]
                }
                dp[i] = numWays;
            }
        }
        // console.log(dp);
        n += Number(dp[str.length]);
    });
    return n;
    
}

console.log(alg(parseInput(s)));