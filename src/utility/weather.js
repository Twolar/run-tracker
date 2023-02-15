const fetch = require('node-fetch');
const {logger} = require('./utility/logger');

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

module.exports = { fetchWeatherForSingleDate, formatWeatherIntoString};