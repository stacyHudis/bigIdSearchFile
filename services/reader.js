const fs = require('fs');
const readline = require('readline');
const matcherParseChunk = require('./matcher.js');
const aggregateAllResults = require('./aggregator');
var _ = require('lodash');

const CHUNK_SIZE = 1000;
const SEARCH_WORDS = 'James,John,Robert,Michael,William,David,Richard,' +
    'Charles,Joseph,Thomas,Christopher,Daniel,Paul,Mark,Donald,George,Kenneth,' +
    'Steven,Edward,Brian,Ronald,Anthony,Kevin,Jason,Matthew,Gary,Timothy,Jose,' +
    'Larry,Jeffrey,Frank,Scott,Eric,Stephen,Andrew,Raymond,Gregory,Joshua,Jerry,' +
    'Dennis,Walter,Patrick,Peter,Harold,Douglas,Henry,Carl,Arthur,Ryan,Roger'

function readAndParseFile() {
    let outStream = fs.createWriteStream("./tests/output.txt");
    let charOffsetStart = 0;
    let lineOffsetStart = 1;
    let chunkString = "";
    let allResults = [];
    let count = 0;

    // fs I/O task offloaded to thread pool of libUv
    let inputStream = fs.createReadStream('./tests/big.txt')
    let rl = readline.createInterface(inputStream, outStream);

    rl.on('line', function (line) {
        count++;
        chunkString += line;
        chunkString += '\n';

        if (count === CHUNK_SIZE) {
            //Parse CHUNK_SIZE lines from file
            let parsedChunkMap = matcherParseChunk(lineOffsetStart, SEARCH_WORDS, charOffsetStart, chunkString);
            //Push result map
            if (!_.isEmpty(parsedChunkMap)) {
                allResults.push(parsedChunkMap);
            }

            lineOffsetStart += count;
            charOffsetStart += chunkString.length;
            chunkString = [];
            count = 0;
        }
    });

    rl.on('close', function () {
        //Parse remaining chunk of file
        if (chunkString.length > 0) {
            let parsedChunkMap = matcherParseChunk(lineOffsetStart, SEARCH_WORDS, charOffsetStart, chunkString);
            if (!_.isEmpty(parsedChunkMap)) {
                allResults.push(parsedChunkMap);
            }
        }
        //Aggregate results and print to console
        let res = aggregateAllResults(allResults);

        //Write results to 'output.txt'
        outStream.write(res);
        outStream.end()
    })
}

module.exports = readAndParseFile