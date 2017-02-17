var longitude = 0;
var latitude = 0;
var address = "";
var c = true;

function getForecast() {

  
  $.ajax({
    url: "https://crossorigin.me/https://api.forecast.io/forecast/42ddf26832c7e1d6bf1d9df040c1a8d1/" + latitude + "," + longitude,
    datatype: "json",
    success: function(response) {
      //console.log(response);
      // CURRENT TEMPERATURE BLOCK
      if (c) $("#currentTemp").html(fc(response.currently.temperature) + "&deg;C");
      else $("#currentTemp").html(response.currently.temperature + "&deg;C");
      console.log(fc(response.currently.temperature));
      $("#summary").html(response.currently.summary);
      $("#lookupButton").html("Address Lookup");
      getAddress(latitude,longitude);
    }
  });
}
/*
function getLocation() {
  var e = document.getElementById("currentTemp");
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(locationSuccess, errorLocation);
    } else {
        e.innerHTML = "Geolocation is not supported by this browser.";
    }

  
}
*/
function locationSuccess(position) {
  
  getForecast();  
  
  longitude = position.coords.longitude;
  latitude = position.coords.latitude;
  var long = document.getElementById("long");
  var lat = document.getElementById("lat");
  long.innerHTML = "Longitude: " + longitude;
  lat.innerHTML = "Latitude: " + latitude;
}

function errorLocation(error) {
  var e = document.getElementByID("currentTemp");
  console.log("ERROR");
    switch(error.code) {
        case error.PERMISSION_DENIED:
            e.innerHTML = "User denied the request for Geolocation."
            break;
        case error.POSITION_UNAVAILABLE:
            e.innerHTML = "Location information is unavailable."
            break;
        case error.TIMEOUT:
            e.innerHTML = "The request to get user location timed out."
            break;
        case error.UNKNOWN_ERROR:
            e.innerHTML = "An unknown error occurred."
            break;
    }
}

function addressLocation(locationInput) {
   $.ajax({
    url: "https://maps.googleapis.com/maps/api/geocode/json?address=" + encodeURIComponent(locationInput) + "&key=AIzaSyAnD4-eA5kPg84p48xud5FEAP8QKtFcX2o",
    datatype: "json",
    success: function(response) {
      console.log(response);
      
      if (response.status == "ZERO_RESULTS") {
        $("#currentTemp").html("Error: Location not found");
        $("#address").html("Please try again");
        $("#summary").html("");
        $("#lat").html("");
        $("#long").html("");
        $("#lookupButton").html("Address Lookup");
      }
      
      latitude = response.results["0"].geometry.location.lat;
      longitude = response.results["0"].geometry.location.lng;
      getForecast();
      setCoords();
    }
  });
}

function getAddress(lat,long) {
   $.ajax({
    url: "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," + long + "&key=AIzaSyAnD4-eA5kPg84p48xud5FEAP8QKtFcX2o",
    datatype: "json",
    success: function(response) {
      console.log(response);
      for (var i=2; i >= 0; i--) {
        console.log("looped");
        if (i < response.results.length && i >= 0) {
          $("#address").html(response.results[i].formatted_address);
          return 0;
        }
      }
      $("#address").html("Error: Location not found");
    }
  });
}

function setCoords() {
  var long = document.getElementById("long");
  var lat = document.getElementById("lat");
  long.innerHTML = "Longitude: " + longitude;
  lat.innerHTML = "Latitude: " + latitude;
}


$(document).ready(function() {
  //getLocation();
 
  $("#locationInput").keyup(function(event){
    if(event.keyCode == 13){
        $("#lookupButton").click();
    }
});
  $("#lookupButton").on("click", function() {
    $("#lookupButton").html("Loading...");
    addressLocation($("#locationInput").val());
    console.log($("#locationInput").val())
  });
});

function fc(n) {
  return Math.round((n-34)*(5/9));
}