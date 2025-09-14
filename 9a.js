const fs = require('fs');
const s = fs.readFileSync('./input.txt').toString();
// const s = `2333133121414131402`;

function parseInput(str) {
    return str.split('').map(v => parseInt(v));
}

function getNextEmpty(files, i) {
    const ix = files.findIndex((v, k) => k>i && v === '.');
    if (ix >= -1) {
        let j = ix + 1;
        while (files[j] === '.') {
            j++;
        }
        return [ix, j - 1];
    }

    return [files.length, files.length];
}

function getRightmostBlock(files, j) {
    const ix = files.findLastIndex((v, k) => k<j && v !== '.');
    if (ix >= -1) {
        const val = files[ix];
        let j = ix - 1;
        while (files[j] === val) {
            j--;
        }
        return [j + 1, ix];
    }

    return [-1, -1];
}

function moveBlock(files, leftStart, rightStart, n) {
    for (let i = 0; i < n; i++) {
        files[leftStart + i] = files[rightStart + i];
        files[rightStart + i] = '.';
    }
}

function alg(list) {
    let files = [];
    let id = 0;
    list.forEach((v, i) => {
        const block = Array(v);
        if (i % 2 === 0) {
            files = files.concat(block.fill(id++));
        } else {
            files = files.concat(block.fill('.'));
        }
    });
    

    const [maxIx] = getRightmostBlock(files, files.length);
    const maxId = files[maxIx];
    let last = files.length;
    for (let i = maxId; i >= 0; i--) {
        const [rightStart, rightEnd] = getRightmostBlock(files, last);
        // console.log('block is at', [rightStart, rightEnd], files.join(''));
        const blockSize = rightEnd - rightStart + 1;
        let [leftStart, leftEnd] = getNextEmpty(files, 0);
        let emptySize = leftEnd - leftStart + 1;

        while(emptySize < blockSize && leftEnd < rightStart && leftEnd > -1) {
            [leftStart, leftEnd] = getNextEmpty(files, leftEnd);
            emptySize = leftEnd - leftStart + 1;
        }

        if (emptySize >= blockSize && leftEnd < rightStart) {
            moveBlock(files, leftStart, rightStart, blockSize);
        }

        last = rightStart;
    }

    
    return files.reduce((acc, v, i) => v === '.' ? acc : acc + v*i, 0);
    // return files;


}

console.log(alg(parseInput(s)));