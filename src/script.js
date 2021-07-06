const electron = require('electron');
const ipcRenderer = electron.ipcRenderer;
ipcRenderer.on('cpu',(event,data) => {
    document.getElementById('cpu').innerHTML = data.toFixed(2);
});
ipcRenderer.on('mem',(event,data) => {
    document.getElementById('mem').innerHTML = data.toFixed(2);
});
ipcRenderer.on('total-mem',(event,data) => {
    document.getElementById('total-mem').innerHTML = data.toFixed(2);
});


window.$ = window.jQuery = require('jquery');

var currentWeather;
var userLocation;
var humidity;
var cityName;
var stateCode;
var url;
var lat;
var lon;
var dailyUrl;
var userip;
var coord;
let darkMode = JSON.parse(localStorage.getItem('darkMode')) || false;

if (darkMode == true) {
  document.body.classList.toggle("dark-theme");
}

$.ajax({
  url: "https://api.ipify.org?format=json",
  async: false,
  dataType: 'json',
  success: function(data) {
      userip = data.ip;
  }
});


function getUserIPandCoords() {
var ipurl = "https://ipinfo.io/"+ userip +"/json?token=dc96dbbe2c952c"
fetch(ipurl)
  .then(function(response) {
    return response.json();
  })
  .then(function(data) {
    console.log(data);
    cityName = data.city;
    stateCode = data.region;
    coord = data.loc;
    lat = coord.split(',')[0];
    lon = coord.split(',')[1];
  })
}

function displayWeatherData() {
  $(".weekly").html('');
  // cityName = $(".city").val();
  // stateCode = $(".state").val();
  url = `https://api.openweathermap.org/data/2.5/weather?lat=`+ lat +`&lon=`+ lon +`&units=imperial&appid=3bb00f30e525b91a1deb9cbd20254379`;
  
  fetch(url)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
              console.log(data);
            if (data.main) {
              currentWeather = data.main.temp;
              userLocation = data.name;
              humidity = data.main.humidity;
              // lat = data.coord.lat;
              // lon = data.coord.lon;

              $(".tempDisplay").html("Temp: " + currentWeather);
              $(".locationDisplay").html("Location: " + cityName + ", " + stateCode);
              $(".humidityDisplay").html("Humidity: " + humidity);
              $(".error").html("");
              dailyUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=`+ lat +`&lon=`+ lon +`&exclude=current,minutely,alerts&units=imperial&appid=3bb00f30e525b91a1deb9cbd20254379`;
              console.log(dailyUrl);
              
              return fetch(dailyUrl)
            }
            else {$(".error").html(data.message);}
      
        })
        .then(function(response) {
            return response.json();
        })
        .then(function(dailyData) {
            for (let day of dailyData.daily) {
              //new Date().toISOString().split('T')[0];
              var date = new Date(day.dt*1000).toISOString().split('T')[0];
              var dailyTemp = day.temp.day;
              $(".weekly").append(`<tr><td>`+date.slice(5)+": "+dailyTemp+`</tr></td>`);
            }
        });
}

getUserIPandCoords();
setTimeout(displayWeatherData, 300);

$(".submit").click(function() {
  displayWeatherData();
});

const btn = document.querySelector(".btn-toggle");
let darkModeJSON;

btn.addEventListener("click", function () {
  document.body.classList.toggle("dark-theme");
  if (document.body.classList[0] == 'dark-theme') {
      darkMode = true;
  }
  else if (document.body.classList[0] == undefined) {
    darkMode = false;
  }
  darkModeJSON = JSON.stringify(darkMode);
  console.log(darkModeJSON);
  localStorage.setItem('darkMode', darkModeJSON);
});
