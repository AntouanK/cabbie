(function() {

'use strict';

var DistanceMatrixService;

//  make a google maps point
var point = function(lat, lng){

  return new google.maps.LatLng(+lat, +lng);
};

// To add the marker to the map, use the 'map' property
var getMarker = function(coords, title){

  if(coords === undefined){
    throw Error('no coordinates given');
  }

  cabbie.map.markers.push(new google.maps.Marker({
      position: coords,
      // animation: google.maps.Animation.DROP,
      map: cabbie.map.ele,
      title: title
  }));
};

var clearMarkers = function(){

  cabbie.map.markers.forEach(function(marker){

    //  remove marker from map
    marker.setMap(null);
  });

  //   delete array
  cabbie.map.markers.length = 0;
};

  //  MAKE BATCH
var calcDistance = function(origins, destinations, deferred){

  deferred = deferred || Q.defer();

  if(calcDistance.isBusy){
    // console.log('busy, adding to queue');
    calcDistance.queue.push({
      origins: origins,
      destinations: destinations,
      deferred: deferred
    });
    return deferred.promise;
  } else {
    calcDistance.isBusy = true;
    setTimeout(function(){

      calcDistance.isBusy = false;
      
      if(calcDistance.queue.length > 0){
        
        var nextArg = calcDistance.queue[0];
        calcDistance.queue = calcDistance.queue.slice(1);
        calcDistance(nextArg.origins, nextArg.destinations, nextArg.deferred);
      }

    }, 40);
  }

  var originsNorm = [],
      destinationsNorm = [];

  //  transform arrays to google map points
  origins.forEach(function(or){
    originsNorm.push(point(or.latitude, or.longitude));
  });

  destinations.forEach(function(or){
    destinationsNorm.push(point(or.latitude, or.longitude));
  });

  //  make the call to the distance service
  DistanceMatrixService.getDistanceMatrix({
    origins: originsNorm,
    destinations: destinationsNorm,
    travelMode: google.maps.TravelMode.DRIVING,
    durationInTraffic: true,
    avoidHighways: false,
    avoidTolls: false
  }, function(res, status){
  
    // console.log('status', status);
    if(status !== 'OK'){
      console.log('no OK, retrying');
      calcDistance(origins, destinations, deferred);
    } else {
      deferred.resolve(res);
    }
  });

  return deferred.promise;
};
calcDistance.queue = [];


var groupsOf = function(divider){

  return function(total){
  
    var raw = total/divider;
    var rounded = parseInt(total/divider, 10);
    return raw > rounded ? rounded+1 : rounded;
  };
};

var calcRouteDistances = function(routePoints){

  var deferred = Q.defer(),
      destinations = routePoints.slice(1),
      errors = [],
      groupsBy = 1,
      groups,
      i;

  //  remove last point ( it's only in destinations )
  routePoints.pop();
  groups = groupsOf(groupsBy)(routePoints.length);
  console.log(routePoints.length, groups);

  var start = 0;
  var end = 0;
  var resultPromises = [];
  for(i=0; i < groups; i+=1){
      
    start = i*groupsBy;
    end = start + groupsBy > routePoints.length ? routePoints.length : start+groupsBy;

    resultPromises.push( calcDistance(
      routePoints.slice(start, end), 
      destinations.slice(start, end)
    ) );
  }

  Q.all(resultPromises)
  .then(function(googleResults){

    googleResults.forEach(function(res, i){
    
      var resData = res.rows[0].elements[0];
      var delay = (+destinations[i].timestamp) - (+routePoints[i].timestamp);

      console.log(resData.distance.value,
      '\t should be \t',
      resData.duration.value,
      '\t we did \t',
      delay,
      (resData.duration.value/delay).toFixed(2) );

      if((resData.duration.value/delay).toFixed(2) > 5){
        errors.push(i);
      }
    });

    deferred.resolve(errors);
  });

  return deferred.promise;
};

var drawRoute = function(routePoints, delayScale){

  //  turn 'replay' option off
  cabbie.nav.setOption('redraw', false);

  //  TODO : check if number, check routePoints
  var startPoint = routePoints[0];
  delayScale = delayScale || 1;

  routePoints
  .forEach(function(routePoint, i){

    // calculate the delay
    var delay = (+routePoint.timestamp) - (+startPoint.timestamp);

    setTimeout(function(){
      var mapsPoint = point(routePoint.latitude, routePoint.longitude);
      getMarker(mapsPoint, "point "+i);
      cabbie.map.ele.setCenter(mapsPoint);

      if(i === routePoints.length){
        //  turn 'replay' option on
        cabbie.nav.setOption('redraw', true);
      }
    }, delay*delayScale);
  });

};

var isInitialized = false;

function initialize() {

  DistanceMatrixService = new google.maps.DistanceMatrixService();
  var mapOptions = {
    center: new google.maps.LatLng(51.530585551433, -0.12274012419932),
    zoom: 15
  };
  cabbie.map.ele = 
  new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
}
//google.maps.event.addDomListener(window, 'load', initialize);

cabbie.map = {
  ele: {},
  markers: [],
  tryRoute: function(routePoints, speed){
  
    if(!isInitialized){
      initialize();
    }

    speed = speed || 10;
    var filteredPoints = [];

    calcRouteDistances(routePoints)
    .then(function(errors){

      routePoints
      .forEach(function(p, i){
      
        if(errors.indexOf(i) !== -1){
          // console.log('skipping error ', i, push);
          return;
        }

        filteredPoints.push(p);
      });

      //  save last route
      cabbie.map.lastRoute = {
        routePoints: filteredPoints
      };

      setTimeout(function(){

        drawRoute(filteredPoints, speed);
      }, 250);
    });
  },
  replay: function(speed){

    console.log('replaying...');
    clearMarkers();
    speed = speed || 12;
    drawRoute(cabbie.map.lastRoute.routePoints, speed);
  }
};


}());

