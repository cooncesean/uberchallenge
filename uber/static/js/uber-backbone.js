$(function(){

  // MODELS
  // A MovieLocation defines a lat/lng and a title for a specific
  // scnene in a movie ..... HOW DOES THIS GET USED IF THE COLLECTION IS
  // GETTING BOOTSTRAPPED OUTSIDE OF THIS FUNCTION?
  var MovieLocation = Backbone.Model.extend({
    defaults: function() {
      return {
        title: "",
        lat: null,
        lng: null,
        address: ""
      };
    }
  });



  // COLLECTIONS (`MovieLocations` is defined and bootstrapped in `index.html`)
  var SelectedMoviesList = Backbone.Collection.extend({
    model: MovieLocation
  });

  // **SelectedMovies** will be a list of movies selected from the autocompleter
  var SelectedMovies = new SelectedMoviesList;



  // MAPVIEW /////////////////////////////////////////////////////////////////
  // Manages UI around the single Google Map binding.
  /////////////////////////////////////////////////////////////////////////////
  var MapView = Backbone.View.extend({
    el: $('#map-canvas'),
    markers: [],

    // Init the map on the page, binding it to #map-canvas
    initialize: function() {
      // Google config
      var mapOptions = {
        center: new google.maps.LatLng(37.7533, -122.4173), // SF
        zoom: 11,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      this.googleMap = new google.maps.Map(
        document.getElementById("map-canvas"),
        mapOptions
      );
      var infowindow = new google.maps.InfoWindow();
      var self = this;

      // Createa a map marker for each location in the `movieLocations` collection
      $.each(movieLocations.models, function(){
        self.createMarker(self.googleMap, this);
      });
    },

    // Create a new marker on the map
    createMarker: function(map, movieLocation){
      // console.log(movieLocation.get('lat'))
      marker = new google.maps.Marker({
        map: map,
        position: new google.maps.LatLng(movieLocation.get('lat'), movieLocation.get('lng')),
        title:  movieLocation.get('title'),
        clickable: true
      });

      // Append the marker to the `markers` array
      this.markers.push(marker);

      // Attach mouse events to each marker binding it to an info window
      var infowindow = new google.maps.InfoWindow({content: ''});
      bindInfoWindow(marker, map, infowindow, '<p><b>'+movieLocation.get('title')+'</b></p><p>'+movieLocation.get('address')+'</p>', movieLocation.get('title'));
      function bindInfoWindow(marker, map, infowindow, html, title) {
        google.maps.event.addListener(marker, 'mouseover', function() {
          infowindow.setContent(html);
          infowindow.open(map, marker);
        });
        google.maps.event.addListener(marker, 'mouseout', function() {
          infowindow.close();
        });
      }
    },

    // Remove all existing markers from the map. Using Google's v3 API,
    // this appears to be the only way to handle this.
    deleteMarkers: function(map){
      while(markers.length){
        markers.pop().setMap(null);
      }
    }
  });
  var mapView = new MapView;

  // AUTOCOMPLETEVIEW /////////////////////////////////////////////////////////
  // This view manages the autocompleter as well as as the selection list
  // that renders the autocompleted results.
  /////////////////////////////////////////////////////////////////////////////
  var AutoCompleterView = Backbone.View.extend({
    el: $('#autocompleter'),

    events: {
      "click #autocompleter-results": "selectResult",
    },

    initialize: function(){
      $(this.el).on('keypress', this.handleAutoComplete);
    },

    // Make an async request to get a matching list of movies
    // when the autocompleter is receives input (greater than 2 chars)
    handleAutoComplete: function(){
      var query = $(this).val();
      if(query.length < 2)
        return;

      console.log(query)

      // Make an async call to fetch any possible matches (DO I NEED A ROUTER FOR THIS?)
      // I DON'T NECESSARILY NEED BACK/FWD HISTORY INFORMATION FOR THIS FEATURE.
      $.ajax({
        url: urlMovies + "?term=" + encodeURIComponent(query),
        dataType: "json",
        type: "get",
        success: function (data) {
          $.map(data['movies'], function(item) {



            console.log({label: item.title});
          });
        }
      });
    }

  });
  var autoCompleterView = new AutoCompleterView;

  // APPVIEW //////////////////////////////////////////////////////////////////
  // Top level piece of UI. This 'glues' everything (the autocompleter,
  // the selector and the map) together.
  /////////////////////////////////////////////////////////////////////////////
  var AppView = Backbone.View.extend({
    // This is a simple container for everything ... we don't really need to update it
    el: $("#container"),

    // At initialization we bind to the relevant events on the `autocomplete input`
    // Loading any all movie locations from the API.
    initialize: function(mapView) {
      this.mapView = mapView;
    },

    // Re-rendering the App just means
    //   1. Updating the markers on the map
    //   2. Clearing the auto-completer
    //   3. Appending their selected result to the user's `search history`
    //   4. Update the 'movie info' dom elements on the side bar
    render: function() {
      console.log('rendering')
      this.map.updateMarkers();
    }

  });
  var app = new AppView(mapView);

});