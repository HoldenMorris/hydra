/**
 * Created by holdenm on 11/26/14.
 */

function getGPSLocation() {
  if (navigator.geolocation) {
    // clearWatch() - Stops the watchPosition() method.
    // navigator.geolocation.watchPosition(showGPSPosition, showGPSError);
    navigator.geolocation.getCurrentPosition(showGPSPosition, showGPSError);
  } else {
    $('#out').html("Geolocation is not supported by this browser.");
  }
}

function showGPSPosition(position) {
  /*
   coords.latitude          The latitude as a decimal number
   coords.longitude         The longitude as a decimal number
   coords.accuracy          The accuracy of position
   coords.altitude          The altitude in meters above the mean sea level
   coords.altitudeAccuracy  The altitude accuracy of position
   coords.heading           The heading as degrees clockwise from North
   coords.speed             The speed in meters per second
   timestamp                The date/time of the response
   */
  console.log(position);
  $('#out').html("Latitude: " + position.coords.latitude + "<br>Longitude: " + position.coords.longitude);
}

function showGPSMap(position) {
  var latlon = position.coords.latitude + "," + position.coords.longitude;
  var img_url = 'http://maps.googleapis.com/maps/api/staticmap?center=' + latlon + '&zoom=14&size=400x300&sensor=false';
  $('#out').append('<img class="googlemap" src="' + img_url + '">');
}

function showGPSError(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      $('#out').html("User denied the request for Geolocation.");
      break;
    case error.POSITION_UNAVAILABLE:
      $('#out').html("Location information is unavailable.");
      break;
    case error.TIMEOUT:
      $('#out').html("The request to get user location timed out.");
      break;
    case error.UNKNOWN_ERROR:
      $('#out').html("An unknown error occurred.");
      break;
  }
}