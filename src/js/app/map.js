(function() {

'use strict';

//
//  our 'map' business logic
//  functions to handle the route and 
//  filtering out any potential 'error' points
//

//  store here the google distance service
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

//  clear all the markers from the map
var clearMarkers = function(){

  cabbie.map.markers.forEach(function(marker){

    //  remove marker from map
    marker.setMap(null);
  });

  //   delete array
  cabbie.map.markers.length = 0;
};


//  calculate the distance between the two arrays
//  get back a promise
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

    }, 45);
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
      //  if for any reason call was unsuccesfull, retry
      console.log('no OK, retrying', origins[0].timestamp);
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

//  filter out any error points by calculating the ratio
//  between the google maps estimated driving time, and the given one.
//  if the given is much smaller than the estimated one ( the ratio is limited
//  by the errorMargin argument ) then it either means that the cab was an airplane, 
//  or that point is an error
var filterErrors = function(array1, array2, errorMargin){

  // console.log('filterErrors with margin', errorMargin);
  if(array1.length !== array2.length){
    throw Error('arrays mismatch');
  }

  var errors = [];

  array1.forEach(function(p, i){
  
    if(p/array2[i] > errorMargin){
      errors.push(i);
    }
  });

  return errors;
};

var calcRouteDistances = function(routePoints, errorMargin){

  var deferred = Q.defer(),
      //  make a copy of the route points, shifted by one, to have the destinations
      destinations = routePoints.slice(1),
      groupsBy = 1,
      groups,
      i;

  errorMargin = errorMargin || 3; //  set a fallback errorMargin value

  //  remove last point ( it's only in destinations )
  //  so now we have the origins
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

  //  when all results are done...
  Q.all(resultPromises)
  .then(function(googleResults){

    console.log('all resolved');

    var googleDurations = googleResults.map(function(res){
      return +res.rows[0].elements[0].duration.value;
    });
    var ourDurations = destinations.map(function(pointInTime, i){
      return (+destinations[i].timestamp) - (+routePoints[i].timestamp);
    });

    deferred.resolve(filterErrors(googleDurations, ourDurations, errorMargin));
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
    }, delay*(30-delayScale));
  });

};

var isInitialized = false;

function initialize() {

  DistanceMatrixService = new google.maps.DistanceMatrixService();
  var mapOptions = {
    center: new google.maps.LatLng(51.530585551433, -0.12274012419932),
    zoom: 14
  };
  cabbie.map.ele = 
  new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
}


//////////////////////////////////////////////////////
//  main map API
cabbie.map = {
  ele: {},  //  store here the main map element
  markers: [],
  tryRoute: function(routePoints, speed, errorMargin){
  
    if(!isInitialized){
      initialize();
    }

    //  set App to 'loading' state
    cabbie.App.setState({ loading: true });

    //  set a default fallback speed value
    speed = speed || 20;
    var filteredPoints = [];

    calcRouteDistances(routePoints, errorMargin)
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

      //  loading is done
      cabbie.App.setState({ loading: false });

      setTimeout(function(){
        //  start drawing
        drawRoute(filteredPoints, speed);
      }, 250);
    });
  },
  //  ability to replay the last route ( cached filtered result )
  replay: function(speed){

    console.log('replaying...');
    clearMarkers();
    speed = speed || 12;
    drawRoute(cabbie.map.lastRoute.routePoints, speed);
  }
};

}());

