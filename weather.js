const weatherCodeMap = {
    0: ["Clear Sky", "sun.png"],
    1: ["Mainly Clear", "sun.png"],
    2: ["Partly Cloudy", "cloudy.png"],
    3: ["Overcast", "overcast.png"],
    45: ["Fog", "fog.png"],
    48: ["Depositing Rime Fog", "fog.png"],
    51: ["Light Drizzle", "rain.png"],
    53: ["Moderate Drizzle", "rain.png"],
    55: ["Dense Drizzle", "rain.png"],
    56: ["Light Freezing Drizzle", "rain.png"],
    57: ["Dense Freezing Drizzle", "rain.png"],
    61: ["Slight Rain", "rain.png"],
    63: ["Moderate Rain", "rain.png"],
    65: ["Heavy Rain", "rain.png"],
    66: ["Light Freezing Rain", "rain.png"],
    67: ["Dense Freezing Rain", "rain.png"],
    71: ["Light Snow", "snow.png"],
    73: ["Moderate Snow", "snow.png"],
    75: ["Heavy Snow", "snow.png"],
    77: ["Snow Grains", "snow.png"],
    80: ["Slight Rain Showers", "rain.png"],
    81: ["Moderate Rain Showers", "rain.png"],
    82: ["Violent Rain Showers", "rain.png"],
    85: ["Slight Snow Showers", "snow.png"],
    86: ["Heavy Snow Showers", "snow.png"],
    95: ["Thunderstorm", "thunderstorm.png"],
    96: ["Thunderstorm With Slight Hail", "thunderstorm.png"],
    99: ["Thunderstorm With Heavy Hail", "thunderstorm.png"]
};

const cityInput = document.getElementById("city-input");
const searchButton = document.getElementById("search-button");
searchButton.addEventListener("click", getWeather);

async function getWeather() {
    const city = cityInput.value.trim();

    // Geocoding API (City → Latitude & Longitude)
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}`;
    const geoResponse = await fetch(geoUrl);
    const geoData = await geoResponse.json();
    console.log(geoData);

    const latitude = geoData.results[0].latitude;
    const longitude = geoData.results[0].longitude;
    const country = geoData.results[0].country;

    // Weather API
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
    const weatherResponse = await fetch(weatherUrl);
    const weatherData = await weatherResponse.json();
    console.log(weatherData)

    const temperature = weatherData.current_weather.temperature;
    const windSpeed = weatherData.current_weather.windspeed;
    const weatherCode = weatherData.current_weather.weathercode;
    let iconCode = "01d"; // Default icon code
    if (weatherCode === 1 || weatherCode === 2) iconCode = "02d";
    else if (weatherCode === 3) iconCode = "03d";
    else if (weatherCode >= 45 && weatherCode <= 48) iconCode = "50d";
    else if (weatherCode >= 51 && weatherCode <= 67) iconCode = "10d";
    else if (weatherCode >= 71 && weatherCode <= 77) iconCode = "13d";
    else if (weatherCode >= 80 && weatherCode <= 82) iconCode = "09d";
    else if (weatherCode >= 95 && weatherCode <= 99) iconCode = "11d";

    const weatherCondition = (weatherCodeMap[weatherCode] || ["Unknown"])[0];

    document.getElementById("weather-image").src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    if (country && city != country) {
        document.getElementById("city").innerText = `${city}, ${country}`;
    }
    else {
        document.getElementById("city").innerText = `${city}`;
    }
    document.getElementById("temperature").innerText = temperature;
    document.getElementById("weather-condition").innerText = weatherCondition;
    document.getElementById("wind-speed").innerText = windSpeed;
}