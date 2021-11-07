function matcherParseChunk(lineOffsetStart, searchWords, charOffsetStart, chunkString) {
    let searchWordsList = searchWords.toLowerCase().split(',');
    let resultsMap = {};
    let lines = chunkString.split('\n');
    lines.pop();

    lines.forEach((line) => {
        searchWordsList.forEach((searchWord) => {
            let startIndex = 0;
            line = line.toLowerCase();
            let foundIndex = line.indexOf(searchWord, startIndex);

            //Find all occurrences of searchWord in line
            while (foundIndex > -1) {
                let results = resultsMap[searchWord];
                if (results == null) {
                    resultsMap[searchWord] = [];
                }

                resultsMap[searchWord].push({'lineOffset': lineOffsetStart, 'charOffset': charOffsetStart + foundIndex})
                foundIndex = line.indexOf(searchWord, foundIndex + 1);
            }
        })

        lineOffsetStart++;
        charOffsetStart += line.length;
    })

    return resultsMap;
}

module.exports = matcherParseChunk