const API_KEY = "285b31f1226172b245204b66404989b2";

let units = "metric";
let lastCity = "";

const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const unitBtn = document.getElementById('unitBtn');

const locationEl = document.getElementById('location');
const weatherDesc = document.getElementById('weatherDesc');
const tempEl = document.getElementById('temp').querySelector("span");
const tempUnitEl = document.getElementById('tempUnit');

const feelsEl = document.getElementById('feels');
const humidityEl = document.getElementById('humidity');
const windEl = document.getElementById('wind');
const pressureEl = document.getElementById('pressure');
const timeEl = document.getElementById('time');

const forecastEl = document.getElementById('forecast');

/* --- ПОЛУЧЕНИЕ ПОГОДЫ --- */
async function fetchWeather(city) {
    if (!city) return alert("Введите город!");

    lastCity = city;

    const urlCur = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=${units}&lang=ru`;
    const urlFor = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=${units}&lang=ru`;

    try {
        const cur = await fetch(urlCur).then(r => r.json());
        if (cur.cod !== 200) throw new Error(cur.message);

        const forData = await fetch(urlFor).then(r => r.json());
        if (forData.cod !== "200") throw new Error(forData.message);

        render(cur, forData);

    } catch (err) {
        alert("Ошибка: " + err.message);
    }
}

/* --- ОТОБРАЖЕНИЕ --- */
function render(cur, forData) {

    locationEl.textContent = `${cur.name}, ${cur.sys.country}`;
    weatherDesc.textContent = cur.weather[0].description;
    tempEl.textContent = Math.round(cur.main.temp);
    tempUnitEl.textContent = units === "metric" ? "°C" : "°F";

    feelsEl.textContent = `Ощущается: ${Math.round(cur.main.feels_like)}${tempUnitEl.textContent}`;
    humidityEl.textContent = `${cur.main.humidity}% влажность`;
    windEl.textContent = `${cur.wind.speed} ${units === "metric" ? "м/с" : "mph"} ветер`;
    pressureEl.textContent = `${cur.main.pressure} гПа`;
    timeEl.textContent = new Date(cur.dt * 1000).toLocaleString();

    /* --- ПРОГНОЗ --- */
    forecastEl.innerHTML = "";

    const daily = [];
    forData.list.forEach(item => {
        const day = item.dt_txt.split(" ")[0];
        if (!daily.includes(day)) daily.push(day);
    });

    daily.forEach((day, i) => {
        if (i >= 5) return;

        const item = forData.list.find(x => x.dt_txt.startsWith(day));

        forecastEl.innerHTML += `
            <div class="weather-card">
                <p>${item.dt_txt.split(" ")[0]}</p>
                <p>${Math.round(item.main.temp)}${tempUnitEl.textContent}</p>
                <p class="desc">${item.weather[0].description}</p>
            </div>
        `;
    });
}

/* --- СОБЫТИЯ --- */
searchBtn.addEventListener("click", () => {
    fetchWeather(cityInput.value.trim());
});

unitBtn.addEventListener("change", () => {
    units = unitBtn.value;
    if (lastCity) fetchWeather(lastCity);
});
