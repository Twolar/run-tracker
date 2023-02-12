const fs = require('fs');
const {logger} = require('./utility/logger');

const completedRunsFile = './output/completedRuns.txt';

function addCompletedRun(data, file = completedRunsFile) {
    logger.info("Outputting results to file");
    let newLineToAdd = data + "\n";
    fs.appendFile(file, newLineToAdd , (error) => {
        logger.error(error);
        return false;
    });
    return true;
}

function getCompletedRuns(file = completedRunsFile) {
    logger.info("Getting run results from file");
    let completedRuns = fs.readFileSync(file,'utf8', (error) => {
        logger.error(error);
        return false;
    });
    
    var completedRunsArray = completedRuns.split("\n");
    completedRunsArray.pop(); // Remove last empty variable for extra \n

    return completedRunsArray;
}

module.exports = { addCompletedRun, getCompletedRuns }