var _ = require('lodash');

function aggregateAllResults(results) {
    let combinedResults = _.reduce(results, (acc, item) => {
        for (const key in item) {
            if (!acc[key]) {
                acc[key] = item[key];
            } else {
                acc[key] = [...acc[key], ...item[key]];
            }
        }
        return acc;
    }, {});

    let searchFileMapStr = printAggregatedResults(combinedResults);

    return searchFileMapStr;
}

function printAggregatedResults(combinedRes) {
    //parsedChunkMap
    let searchFileMapStr = "";
    Object.keys(combinedRes).forEach((key) => {
        let searchNameOutput = "" + key + " --> " + combinedRes[key].length + "[";
        combinedRes[key].forEach((offsetData) => {
            searchNameOutput += "[lineOffset = " + offsetData.lineOffset + ",";
            searchNameOutput += "charOffset = " + offsetData.charOffset + "]" + "\n";
        })
        searchNameOutput += "]";
        searchNameOutput += "\n";
        searchFileMapStr += searchNameOutput;
    })

    //Print to console
    console.log(searchFileMapStr);
    return searchFileMapStr;
}

module.exports = aggregateAllResults
