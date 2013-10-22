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

  // ROUTER
  var Workspace = Backbone.Router.extend({
    routes: {
      "movies":               "movies",          // #movies/
      "movies/:query":        "movies",          // #movies/kiwis
      "search_history":       "search_history",  // #search_history
    },

    // Fetches all movies (or a filtered subset)
    movies: function(query) {
      console.log('movies');
      console.log(query);
    },

    // Manipulates the user's search history
    search_history: function() {
      console.log('search_history')
    }
  });


  // VIEWS
  // Top-level piece of UI.
  var AppView = Backbone.View.extend({
    el: $("#container"),

    // Delegated events for searching for specific movies,
    // and selecting autocompleted results
    events: {
      "keypress #movie-title":  "searchForMovie",
      "click #autocompleter-results": "selectResult",
    },

    // At initialization we bind to the relevant events on the `autocomplete input`
    // Loading any all movie locations from the API.
    initialize: function() {

      // Bind autocompleter actions
      this.autocompleter = this.$("#autocompleter");
      this.autocompleter.on('keypress', this.handleAutoComplete);

      // Bind map actions and initialize the map
      this.map_dom = this.$("#map-canvas");
      this.markers = [];
      this.initializeMap();
    },

    foo: function(collection, response, options){
      console.log(collection);
    },

    // Re-rendering the App just means
    //   1. Updating the markers on the map
    //   2. Clearing the auto-completer
    //   3. Appending their selected result to the user's `search history`
    //   4. Update the 'movie info' dom elements on the side bar
    render: function() {
      console.log('rendering')
      this.map.updateMarkers();
    },

    // Make an async request to get a matching list of movies
    // when the autocompleter is receives input
    handleAutoComplete: function(){
      var query = $(this).val();
      if(query.length < 2)
        return;
      console.log(query);


    },

    // Google Maps initialization
    initializeMap: function(){
      // Google config
      var mapOptions = {
        center: new google.maps.LatLng(37.7533, -122.4173),
        zoom: 11,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      this.map = new google.maps.Map(
        document.getElementById("map-canvas"),
        mapOptions
      );
      var infowindow = new google.maps.InfoWindow();
      var self = this;

      // Iterate over each movie in the collection and create a marker
      $.each(MovieLocations.models, function(){
        self.createMarker(
          self.map,
          this
        );
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

  // Instantiate the **App**.
  var App = new AppView;

});