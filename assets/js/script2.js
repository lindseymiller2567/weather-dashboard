var cityFormEl = document.querySelector("#city-search")
var cityInputEl = document.querySelector("#city")
var cityContainerEl = document.querySelector("#current-city-container")

var currentCityEl = document.querySelector(".current-city")
var currentTempEl = document.querySelector(".current-temp")
var currentWindEl = document.querySelector(".current-wind")
var currentHumidityEl = document.querySelector(".current-humidity")
var currentUvEl = document.querySelector(".current-uv")


// var dayOneForcast = document.querySelector("#day1")
// var dayTwoForcast = document.querySelector("#day2")
// var dayThreeForcast = document.querySelector("#day3")
// var dayFourForcast = document.querySelector("#day4")
// var dayFiveForcast = document.querySelector("#day5")
var forcastDate = document.querySelector(".date")
var forcastIcon = document.querySelector(".weather-icon")
var forcastTemp = document.querySelector(".temp")
var forcastWind = document.querySelector(".wind")
var forcastHumidity = document.querySelector(".humidity")

// after clicking "search", this function is executed
var formSubmitHandler = function (event) {
    event.preventDefault();
    // get value from input element
    var cityName = cityInputEl
        .value
        .trim() // removes any spaces

    if (cityName) {
        getCoord(cityName)
        cityInputEl.value = "" // removes the city name you just entered
    } else {
        alert("Please enter a City.")
    }
}

// gets coordinates of city entered in search bar 
var getCoord = function (city) {
    var currentCity = city
    currentCityEl.textContent = currentCity

    // format the OpenWeather API URL
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=1b50cbb3b2c102d6f7def4cf1a1ea24d&units=imperial"
    console.log(apiUrl)

    // make a request to the url
    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                var lon = data.coord.lon
                var lat = data.coord.lat
                getCurrentWeather(lon, lat)
            })
        } else {
            alert("Error: City Not Found. Please check spelling.")
        }
    })
        .catch(function (error) {
            alert("Unable to connect to Open Weather")
        })
}

// after getting the city coordinates, then we can fetch the "One Call API"
var getCurrentWeather = function (lon, lat) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly&appid=1b50cbb3b2c102d6f7def4cf1a1ea24d&units=imperial"
    console.log(apiUrl)

    // make a request to the url
    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                displayCurrentWeather(data)
            })
        } else {
            alert("Error: City Not Found. Please check spelling.")
        }
    })
        .catch(function (error) {
            alert("Unable to connect to Open Weather")
        })
}

var displayCurrentWeather = function (city) {

    var humanDate = convertDate(city.current.dt)
    var currentDateEl = document.createElement("span")
    currentDateEl.textContent = " (" + humanDate + ")"
    currentCityEl.appendChild(currentDateEl)

    var icon = city.current.weather[0].icon
    var iconUrl = "https://openweathermap.org/img/wn/" + icon + ".png"
    var iconEl = document.createElement("img")
    iconEl.setAttribute("src", iconUrl)
    currentCityEl.appendChild(iconEl)

    var currentTemp = "Temp: " + city.current.temp + " °F"
    currentTempEl.textContent = currentTemp

    var currentWind = "Wind: " + city.current.wind_speed + " MPH"
    currentWindEl.textContent = currentWind

    var currentHumidity = "Humidity: " + city.current.humidity + " %"
    currentHumidityEl.textContent = currentHumidity

    var currentUV = "UV Index: " + city.current.uvi + " %"
    currentUvEl.textContent = currentUV

    display5DayForcast(city)
}

var display5DayForcast = function (city) {
    for (var i = 1; i < 6; i++) {

        document.querySelector("#day" + i + ">.date").innerHTML = convertDate(city.daily[i].dt)

        var icon = city.daily[1].weather[0].icon
        var iconUrl = "https://openweathermap.org/img/wn/" + icon + ".png"
        var iconEl = document.createElement("img")
        iconEl.setAttribute("src", iconUrl)
        document.querySelector("#day" + i + ">.weather-icon").appendChild(iconEl)

        document.querySelector("#day" + i + ">.temp").innerHTML = "Temp: " + city.daily[i].temp.day + " °F"
        document.querySelector("#day" + i + ">.wind").innerHTML = "Wind: " + city.daily[i].wind_speed + " MPH"
        document.querySelector("#day" + i + ">.humidity").innerHTML = "Humidity: " + city.daily[i].humidity + " %"

    }
}

// convert date from unix to human readable format
var convertDate = function (unixTimeStamp) {
    var milliseconds = unixTimeStamp * 1000
    var date = new Date(milliseconds)
    return (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear()
}

cityFormEl.addEventListener("submit", formSubmitHandler)