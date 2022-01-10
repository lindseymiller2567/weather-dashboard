var cityFormEl = document.querySelector("#city-search")
var cityInputEl = document.querySelector("#city")
var cityContainerEl = document.querySelector("#current-city-container")
var searchHistoryEl = document.querySelector("#search-history")

// current weather elements
var currentCityEl = document.querySelector(".current-city")
var currentTempEl = document.querySelector(".current-temp")
var currentWindEl = document.querySelector(".current-wind")
var currentHumidityEl = document.querySelector(".current-humidity")
var currentUvEl = document.querySelector(".current-uv")

// forcast elements
var forcastDate = document.querySelector(".date")
var forcastIcon = document.querySelector(".weather-icon")
var forcastTemp = document.querySelector(".temp")
var forcastWind = document.querySelector(".wind")
var forcastHumidity = document.querySelector(".humidity")

// create array to hold cities for saving
var cities = []

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
        alert("Please enter a City.") // alert user if they do not enter a city at all
    }
}

// gets coordinates of city entered in search bar 
var getCoord = function (city) {

    // format the OpenWeather API URL
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=1b50cbb3b2c102d6f7def4cf1a1ea24d&units=imperial"
    // console.log(apiUrl)

    // make a request to the url
    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                var lon = data.coord.lon
                var lat = data.coord.lat
                getWeather(lon, lat)

                var currentCity = data.name
                currentCityEl.textContent = currentCity

                if (!cities.includes(currentCity)) {
                    cities.push(currentCity) // push the currentCity into the cities array
                    saveToSearchHistory() // save to local storage
                    createButton(currentCity) // creates button for city under search history
                }
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
var getWeather = function (lon, lat) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly&appid=1b50cbb3b2c102d6f7def4cf1a1ea24d&units=imperial"
    // console.log(apiUrl)

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

    var uvNum = city.current.uvi
    var currentUV = "UV Index: " + uvNum
    currentUvEl.textContent = currentUV

    // display green, red or yellow text based on degree of uv index
    if (uvNum < 2) {
        currentUvEl.classList.add("text-success")
    } else if (uvNum > 6) {
        currentUvEl.classList.add("text-danger")
    } else {
        currentUvEl.classList.add("text-warning")
    }

    display5DayForcast(city)
}

var display5DayForcast = function (city) {

    document.querySelector("#title").innerHTML = "5 Day Forcast:"

    for (var i = 1; i < 6; i++) {

        // add css styles to elements created in forcast section 
        document.querySelector("#day" + i).classList.add("forcast")

        // date (run timestamp value in the convertDate function)
        document.querySelector("#day" + i + ">.date").innerHTML = convertDate(city.daily[i].dt)
        document.querySelector("#day" + i + ">.date").classList.add("forcast-date")

        // icon
        var icon = city.daily[i].weather[0].icon
        var iconUrl = "https://openweathermap.org/img/wn/" + icon + ".png"
        document.querySelector("#day" + i + ">.weather-icon").setAttribute("src", iconUrl)

        // temp
        document.querySelector("#day" + i + ">.temp").innerHTML = "Temp: " + city.daily[i].temp.day + " °F"

        // wind
        document.querySelector("#day" + i + ">.wind").innerHTML = "Wind: " + city.daily[i].wind_speed + " MPH"

        // humidity
        document.querySelector("#day" + i + ">.humidity").innerHTML = "Humidity: " + city.daily[i].humidity + " %"
    }
}

// convert date from unix to human readable format
var convertDate = function (unixTimeStamp) {
    var milliseconds = unixTimeStamp * 1000
    var date = new Date(milliseconds)
    return (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear()
}

// function uses event delegation to find what button was clicked on
var retriveWeather = function (event) {
    // console.log(event.target.innerHTML + " was clicked")
    getCoord(event.target.innerHTML)
}

var saveToSearchHistory = function () {
    localStorage.setItem("cities", JSON.stringify(cities)) // saves to local storage
}

var loadSearchHistory = function () {
    var savedCities = localStorage.getItem("cities")

    if (savedCities === null) {
        return false;
    }

    cities = JSON.parse(savedCities)

    for (var i = 0; i < cities.length; i++) {
        createButton(cities[i])
    }
}

// display in left side of page as button 
var createButton = function (city) {
    var searchHistoryBtn = document.createElement("button")
    searchHistoryBtn.classList.add("btn-secondary", "btn", "col-12", "align-items-center", "mt-2")
    searchHistoryBtn.innerHTML = city
    document.querySelector("#search-history").appendChild(searchHistoryBtn)
}

cityFormEl.addEventListener("submit", formSubmitHandler)

searchHistoryEl.addEventListener("click", retriveWeather)

loadSearchHistory()