import { input, inputError, button } from './index.js';

function getPosition() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation is not supported by your browser'));
        } else {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        }
    });
}

async function getCityFromCoordinates(latitude, longitude) {
    const url = new URL('https://api.bigdatacloud.net/data/reverse-geocode-client');
    url.searchParams.set('latitude', latitude);
    url.searchParams.set('longitude', longitude);
    url.searchParams.set('localityLanguage', 'en');

    try {
        const response = await fetch(url.toString());
        if (!response.ok) throw new Error('Network error while searching for city');

        const data = await response.json();
        const city = data.city || data.locality || 'City not found';
        console.log(`City by coordinates (${latitude}, ${longitude}):`, city);
        return city;
    } catch (error) {
        console.error("Error searching for city:", error);
        return null;
    }
}

async function getWeatherData(city) {
    if (!city) return;

    try {
        const apiKey = '5MLKJE3ENGY6YZY357HWFK6KE';
        const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=${apiKey}&contentType=json`;

        let response = await fetch(url);
        if (!response.ok) throw new Error('City not found. Please check the spelling.');
        let json = await response.json();
        console.log("Weather:", json);
        return json;
    } catch (error) {
        console.log("Error getting weather:", error);
    }
}

function getCleanData(data) {
    const city = data.address;
    const temperature = data.currentConditions.temp;
    const description = data.currentConditions.conditions;
    const icon = data.currentConditions.icon;
    console.log(city, temperature, description);
    return { city, temperature, description, icon };
}
async function displayWeather(data) {
    const { city, temperature, description } = data;
    document.getElementById('city').textContent = "CURRENT CITY: " + city;
    document.getElementById('temperature').textContent = "TEMPERATURE: " + temperature + " °C";
    document.getElementById('description').textContent = "TODAY'S FORECAST: " + description;
    const img = document.querySelector('img');
    img.src = await getIcon(data.icon);
}

async function getIcon(iconName) {
    const apiKey = 'gHYAFlb2NML7QpeW81rWBUu5OyCXno2M';
    const response = await fetch(`https://api.giphy.com/v1/gifs/translate?api_key=${apiKey}&s=${iconName}`);
    const iconData = await response.json();
    return iconData.data.images.original.url;
}

async function startApp() {
    try {
        console.log("Requesting geolocation...");

        const position = await getPosition();

        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        console.log("Coordinates received:", lat, lon);

        const city = await getCityFromCoordinates(lat, lon);
        description.textContent = "Loading...";
        const weatherData = await getWeatherData(city);
        let cleanData = getCleanData(weatherData);
        displayWeather(cleanData);

    } catch (error) {
        console.error("Something went wrong:", error.message);
        alert("Unable to determine location. Allow access to geolocation or enter the city manually.");
    }
}

async function getWeather() {
    if (input.validity.valid) {
        try {
            inputError.textContent = "";
            inputError.className = "error";
            input.classList.remove("invalid");
            const city = input.value;
            description.textContent = "Loading...";
            const weatherData = await getWeatherData(city);
            let cleanData = getCleanData(weatherData);
            displayWeather(cleanData);
            input.value = '';
        } catch (error) {
            description.textContent = "";
            alert(error.message);
        }

    } else {
        showError();
        return;
    }
}

function showError() {
    if (input.validity.valueMissing) {
        inputError.textContent = "You need to enter your country.";
    } else if (input.validity.patternMismatch) {
        inputError.textContent = "Please enter only latin letters.";
    } else if (input.validity.tooShort) {
        inputError.textContent = `Country should be at least ${input.minLength} characters; you entered ${input.value.length}.`;
    }
}

export { startApp, getWeatherData, getCleanData, displayWeather, getWeather, showError }; 