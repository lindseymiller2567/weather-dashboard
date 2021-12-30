var getCity = function (city) {
    // formate the OpenWeather API URL
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=1b50cbb3b2c102d6f7def4cf1a1ea24d"

    // make a request to the url
    fetch(apiUrl).then(function (response) {
        response.json().then(function (data) {
            console.log(data)
        })
    })
}

getCity("Milwaukee")