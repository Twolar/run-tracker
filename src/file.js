const fs = require('fs');
const {logger} = require('./utility/logger');

const completedRunsFile = './output/completedRuns.txt';

function addCompletedRun(data) {
    logger.info("Outputting results to file");
    let newLineToAdd = data + "\n";
    fs.appendFile(completedRunsFile, newLineToAdd , (error) => {
        logger.error(error)
    });
}

function getCompletedRuns() {
    logger.info("Getting run results from file");
    let completedRuns = fs.readFileSync(completedRunsFile,'utf8', (error) => {
        logger.error(error);
    });
    
    let completedRunsArray = completedRuns.split("\n");
    completedRunsArray.pop();

    return completedRunsArray;
}

module.exports = { addCompletedRun, getCompletedRuns }