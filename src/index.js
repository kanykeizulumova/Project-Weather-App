import './style.css';
import { startApp, getWeatherData, getCleanData, displayWeather, getWeather, showError } from './getData.js';

startApp();


const input = document.getElementById('city-input');
const inputError = document.querySelector("#city-input + span.error");
const button = document.getElementById('get-weather');

button.addEventListener('click', async () => {
    getWeather();
});
input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        getWeather();

    }
});

export { input, inputError, button };


