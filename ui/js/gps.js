/**
 * Created by holdenm on 11/26/14.
 */

function getGPSLocation(callback) {
  if (navigator.geolocation) {
    // clearWatch() - Stops the watchPosition() method.
    // navigator.geolocation.watchPosition(showGPSPosition, showGPSError);
    navigator.geolocation.getCurrentPosition(callback, function(error){
      switch (error.code) {
        case error.PERMISSION_DENIED:
          callback(null,"User denied the request for GPS.");
          break;
        case error.POSITION_UNAVAILABLE:
          callback(null,"Location information is unavailable.");
          break;
        case error.TIMEOUT:
          callback(null,"The request to get GPS location timed out.");
          break;
        case error.UNKNOWN_ERROR:
          callback(null,"An unknown GPS error occurred.");
          break;
      }
    });
  } else {
    callback(null,"Geolocation is not supported by this browser.");
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
  $('#out').append('<p>Latitude: '+position.coords.latitude +'<br/>Longitude: ' +position.coords.longitude+'</p>');
}

function showGPSMap(position) {
  var latlon = position.coords.latitude + "," + position.coords.longitude;
  var img_url = 'http://maps.googleapis.com/maps/api/staticmap?center=' + latlon + '&zoom=14&size=400x300&sensor=false';
  $('#out').append('<img class="googlemap" src="' + img_url + '">');
}