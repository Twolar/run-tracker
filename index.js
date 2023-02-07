const yargs = require('yargs');
const fetch = require('node-fetch');
const pino = require('pino');

const logger = pino({ level: process.env.LOG_LEVEL || 'info'});

// Customize yargs version
yargs.version('1.1.0');

async function fetchWeatherForSingleDate(date) {
    logger.info("Fetching weather for specified date.");

    let queryUrl = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/Mt%20Eden%2C%20Auckland%2C%20New%20Zealand/${date}/${date}?unitGroup=metric&include=days%2Cobs&key=V6A8KLPTXBWXUDMZAGAUXPFJE&contentType=json`;
    
    try {
        const response = await fetch(queryUrl);
        const responseJson = await response.json();
        logger.info("Weather API call and JSON conversion complete.");
        return responseJson.days[0];
    } catch (error) {
        logger.error(error);
        return;
    }
}

function formatWeatherIntoString(weatherForSingleDay) {
    logger.info("Formatting weather details into string");
    var weatherString = `Conditions: ${weatherForSingleDay.conditions} | Temperature: ${weatherForSingleDay.temp} degrees`;
    return weatherString
}

function formatRunDetailsIntoString(runCompleted) {
    logger.info("Formatting run details into string");
    var runDetailsString = `Distance Run: ${runCompleted.distanceRan}km | Time it took: ${runCompleted.timeTaken} minutes | Average Pace: ${runCompleted.averagePace} min/km`;
    return runDetailsString
}

async function generateOutputString(runCompleted, date) {
    logger.info("Generating output string");
    var weatherForSingleDay = await fetchWeatherForSingleDate(date);
    var outputString = formatRunDetailsIntoString(runCompleted) + " | " + formatWeatherIntoString(weatherForSingleDay);
    return outputString;
}
   
// Create add command
yargs.command({
    command: 'runCompleted',
    describe: 'Calculates stats for a run completed based off time and distance',
    builder: {
        dateCompleted: {
            describe: 'Date of run completed in format YYYY-MM-DD',
            demandOption: true,  // Required
            type: 'string'     
        },
        distanceCompleted: {  
            describe: 'Distance ran',
            demandOption: true,
            type: 'number'
        },
        timeTaken: {  
            describe: 'How long the run took in minutes',
            demandOption: true,
            type: 'number'
        },
    },
  
    // Function for your command
    handler(argv) {
        const runCompleted = {
            distanceRan: argv.distanceCompleted,
            timeTaken: argv.timeTaken,
            averagePace: Number(argv.timeTaken/argv.distanceCompleted).toFixed(2),
            dateCompleted: argv.dateCompleted
          };

          generateOutputString(runCompleted, argv.dateCompleted)
          .then(outputString => console.log(outputString))
          .catch(error => logger.error(error));
    }
})

yargs.parse() // To set above changes