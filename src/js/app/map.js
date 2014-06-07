(function() {

'use strict';

var point = function(lat, lng){

  return new google.maps.LatLng(lat, lng);
};

// To add the marker to the map, use the 'map' property
var getMarker = function(coords, title){

  if(coords === undefined){
    throw Error('no coordinates given');
  }

  return new google.maps.Marker({
      position: coords,
      map: cabbie.map.ele,
      title: title || "Hello World!"
  });
};

var drawRoute = function(routePoints, delayScale){

  //  TODO : check if number, check routePoints
  var startPoint = +routePoints[0].timestamp;
  delayScale = delayScale || 1;

  routePoints
  .forEach(function(routePoint){
    var delay = (+routePoint.timestamp) - startPoint;

    setTimeout(function(){
      var mapsPoint = point(routePoint.latitude, routePoint.longitude);
      getMarker(mapsPoint);
    }, delay*delayScale);
  });
};

var isInitialized = false;

cabbie.map = {
  ele: {},
  tryRoute: function(pointsInTime){
  
    if(!isInitialized){
      initialize();
    }

    drawRoute(pointsInTime, 10);
    console.log('cabbie.map.tryRoute', pointsInTime);
  }
};


function initialize() {
  var mapOptions = {
    center: new google.maps.LatLng(51.530585551433, -0.12274012419932),
    zoom: 13
  };
  cabbie.map.ele = 
  new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
}
//google.maps.event.addDomListener(window, 'load', initialize);

}());

