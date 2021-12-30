var cityFormEl = document.querySelector("#city-search")
var cityInputEl = document.querySelector("#city")
var citySerachTerm = document.querySelector("#city-search-term")
var cityContainerEl = document.querySelector("#city-container")

var currentCityEl = document.querySelector(".current-city")
var weatherIcon = document.querySelector("#weather-icon")
var currentTempEl = document.querySelector(".current-temp")
var currentWindEl = document.querySelector(".current-wind")
var currentHumidityEl = document.querySelector(".current-humidity")
var currentUvIndexEl = document.querySelector(".current-uv-index")

// after clicking "search", this function is executed
var formSubmitHandler = function (event) {
    event.preventDefault();
    // get value from input element
    var cityName = cityInputEl
        .value
        .trim() // removes any spaces

    if (cityName) {
        getCityWeather(cityName)
        cityInputEl.value = "" // removes the city name you just entered
    } else {
        alert("Please enter a City.")
    }
}

var getCityWeather = function (city) {
    // formate the OpenWeather API URL
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=1b50cbb3b2c102d6f7def4cf1a1ea24d&units=imperial"

    // make a request to the url
    fetch(apiUrl).then(function (response) {
        response.json().then(function (data) {
            displayCurrentWeather(data, city)
            // console.log(data)
            // console.log(city)
        })
    })
}

// display search results
var displayCurrentWeather = function (city, searchTerm) {
    // clear old content
    //cityContainerEl.textContent = ""
    //citySerachTerm.textContent = searchTerm

    // console.log(city)
    // console.log(searchTerm)

    var currentCity = city.name
    currentCityEl.textContent = currentCity

    // var icon = city.weather.icon
    // //var iconUrl = "https://openweathermap.org/img/wn/" + icon + ".png"
    // console.log(icon)
    // //weatherIcon.attributes("src", iconUrl)

    var currentTemp = "Temp: " + city.main.temp + " Fahrenheit"
    currentTempEl.textContent = currentTemp

    var currentWind = "Wind: " + city.wind.speed + " MPH"
    currentWindEl.textContent = currentWind

    var currentHumidity = "Humidity: " + city.main.humidity + " %"
    currentHumidityEl.textContent = currentHumidity

    // var currentUV = 
    // var currentUvIndexEl = currentUV

}

cityFormEl.addEventListener("submit", formSubmitHandler)
