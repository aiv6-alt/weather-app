const API_KEY = "f646cc75cfe848a0af460526261106";

const weatherCard = document.getElementById("weatherCard");

async function getWeather(cityName = null){

    const city =
        cityName ||
        document.getElementById("cityInput").value;

    if(!city) return;

    saveSearch(city);

    const url =
    `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=3&aqi=yes&alerts=no`;

    try{

        const response = await fetch(url);

        if(!response.ok){
            throw new Error("City not found");
        }

        const data = await response.json();

        displayCurrentWeather(data);
        displayForecast(data.forecast.forecastday);

        updateBackground(
            data.current.condition.text.toLowerCase()
        );

    }
    catch(error){
        alert(error.message);
    }
}

function displayCurrentWeather(data){

    weatherCard.style.display = "block";

    document.getElementById("city").textContent =
        `${data.location.name}, ${data.location.country}`;

    document.getElementById("condition").textContent =
        data.current.condition.text;

    document.getElementById("temp").textContent =
        ` ${data.current.temp_c} °C`;

    document.getElementById("humidity").textContent =
        ` Humidity: ${data.current.humidity}%`;

    document.getElementById("wind").textContent =
        ` Wind: ${data.current.wind_kph} km/h`;

    document.getElementById("aqi").textContent =
        ` PM2.5: ${data.current.air_quality.pm2_5.toFixed(2)}`;

    document.getElementById("weatherIcon").src =
        "https:" + data.current.condition.icon;
}

function displayForecast(days){

    const container =
        document.getElementById("forecastContainer");

    container.innerHTML = "";

    days.forEach(day => {

        container.innerHTML += `
        <div class="forecast-card">
            <h3>${day.date}</h3>

            <img src="https:${day.day.condition.icon}">

            <p>${day.day.condition.text}</p>

            <p>⬆ ${day.day.maxtemp_c}°C</p>

            <p>⬇ ${day.day.mintemp_c}°C</p>
        </div>
        `;
    });
}

function getCurrentLocation(){

    navigator.geolocation.getCurrentPosition(
        async position => {

            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            getWeather(`${lat},${lon}`);
        },
        () => alert("Location access denied")
    );
}

function updateBackground(condition){

    document.body.classList.remove(
        "sunny",
        "cloudy",
        "rainy"
    );

    if(condition.includes("sun")){
        document.body.classList.add("sunny");
    }
    else if(
        condition.includes("rain") ||
        condition.includes("drizzle")
    ){
        document.body.classList.add("rainy");
    }
    else{
        document.body.classList.add("cloudy");
    }
}

document
.getElementById("themeBtn")
.addEventListener("click",()=>{

    document.body.classList.toggle("dark");

    localStorage.setItem(
        "theme",
        document.body.classList.contains("dark")
    );
});

function loadTheme(){

    if(localStorage.getItem("theme")==="true"){
        document.body.classList.add("dark");
    }
}

function saveSearch(city){

    let searches =
        JSON.parse(
            localStorage.getItem("recentSearches")
        ) || [];

    searches = searches.filter(c => c !== city);

    searches.unshift(city);

    searches = searches.slice(0,5);

    localStorage.setItem(
        "recentSearches",
        JSON.stringify(searches)
    );

    renderRecentSearches();
}

function renderRecentSearches(){

    const div =
        document.getElementById("recentSearches");

    const searches =
        JSON.parse(
            localStorage.getItem("recentSearches")
        ) || [];

    div.innerHTML = "";

    searches.forEach(city => {

        const btn =
            document.createElement("button");

        btn.textContent = city;

        btn.className = "recent-btn";

        btn.onclick = () => getWeather(city);

        div.appendChild(btn);
    });
}

loadTheme();
renderRecentSearches();

window.onload = () => {
    getWeather("London");
};