$(function(){
  // Note that the `Movie` model and `movies` collection
  // are declared in `index.html` for bootstrapping purposes.

  // COLLECTIONS //////////////////////////////////////////////////////////////
  var SelectedMovieHistory = Backbone.Collection.extend({
    model: Movie
  });

  // AUTOCOMPLETE-INPUT VIEW //////////////////////////////////////////////////
  //   Manages input to the `#autocomplete-input` as well as updating the
  //   response <ul> container.
  /////////////////////////////////////////////////////////////////////////////
  var AutoCompleteInputView = Backbone.View.extend({
    el: $('#autocomplete-input'),

    initialize: function(){
      // Wire up the autocompleter dom element `this.el`
      // Note: The jqueryui.autcomplete instance fires an `autocompleteselect`
      //       event when a result is selected. The list passed to the `source`
      //       of the autocompleter is the list of initial movie names.
      this.$el.autocomplete({
        source : allMovies.pluck("title"),
        minLength : 2,
        select: function(event, ui){
          // Get the movie object from the `allMovies` collection
          movie = allMovies.findWhere({'title': ui.item.value})

          // Instantiate and new `MovieInfoView` and pass the selected movie to it
          var movieInfo = new MovieInfoView({model: movie});
          movieInfo.render();

          var searchHistory = new SearchHistory({model: movie});
          searchHistory.render();
        }
      });
    },
  });
  var autcompleteInput = new AutoCompleteInputView;

  // MAPVIEW /////////////////////////////////////////////////////////////////
  //   Manages UI around the single Google Map binding.
  ////////////////////////////////////////////////////////////////////////////
  var MapView = Backbone.View.extend({
    el: $('#map-canvas'),
    markers: [],

    // Init the map on the page, binding it to #map-canvas
    initialize: function() {
      // Bind the `updateMap` method and listen to the `autocompleteselect` event
      _.bindAll(this, "updateMap");
      $("#autocomplete-input").on("autocompleteselect", this.updateMap);

      // Google config
      var mapOptions = {
        center: new google.maps.LatLng(37.7533, -122.4173),
        zoom: 11,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      this.googleMap = new google.maps.Map(this.el, mapOptions);
      var infowindow = new google.maps.InfoWindow();
      var self = this;

      // Createa a map marker for each location in the `movieLocations` collection
      // note: `movieLocations` is a collection bootstrapped in `index.html`.
      $.each(allMovies.models, function(){
        self.createMarkerForMovie(this);
      });
    },

    // Create a new markers on the map for each lat/lng in `movie` objects
    // `addy_plus_geo` list.
    createMarkerForMovie: function(movie){
      var self = this;
      $.each(movie.get('addy_plus_geo'), function(){

        // Create the marker object
        marker = new google.maps.Marker({
          map: self.googleMap,
          position: new google.maps.LatLng(
            this.geo.lat,
            this.geo.lng
          ),
          title: movie.get('title'),
          clickable: true
        });

        // Append the marker to the `markers` array
        self.markers.push(marker);

        // Attach mouse events to each marker binding it to an info window
        var infowindow = new google.maps.InfoWindow({content: ''});
        var windowContent = '<p><b>'+movie.get('title')+'</b></p><p>'+this.address+'</p>'
        bindInfoWindow(marker, self.googleMap, infowindow, windowContent, movie.get('title'));
        function bindInfoWindow(marker, map, infowindow, html, title) {
          google.maps.event.addListener(marker, 'mouseover', function() {
            infowindow.setContent(html);
            infowindow.open(map, marker);
          });
          google.maps.event.addListener(marker, 'mouseout', function() {
            infowindow.close();
          });
        }
      });
    },

    // Remove all existing markers from the map. Using Google's v3 API,
    // this appears to be the only way to handle this.
    deleteMarkers: function(){
      while(this.markers.length){
        this.markers.pop().setMap(null);
      }
    },

    // The map is updated whenever a selection has been made from the autocomplete
    // results.
    updateMap: function(event, selection){
      // Get the movie object from the `allMovies` collection
      movie = allMovies.findWhere({'title': selection.item.value})

      // Delete all of the existing markers
      this.deleteMarkers();

      // Create new markers for only this location
      this.createMarkerForMovie(movie);
    }
  });
  var mapView = new MapView;

  // MOVIE INFO  //////////////////////////////////////////////////////////////
  //   Manages UI regarding the movie info and locations on the sidebar (under
  //   the autocompleter), once a movie is selected.
  /////////////////////////////////////////////////////////////////////////////
  var MovieInfoView = Backbone.View.extend({
    el: $("#selected-movie-info"),
    model: Movie,
    tagName: 'div',
    template: _.template($('#movie-info-template').html()),

    render: function(){
      this.$el.html(this.template(this.model.toJSON()));
    },
  });

  // SELECTED MOVIE HISTORY ///////////////////////////////////////////////////
  //   Manages the `history` <ul> and updates it whenever a user selects a new
  //   movie from the autocompleter.
  /////////////////////////////////////////////////////////////////////////////
  var SearchHistory = Backbone.View.extend({
    el: $("ul#history"),
    model: Movie,
    tagName: 'li',
    template: _.template($('#selected-movie-history-template').html()),

    render: function(){
      var li = this.template(this.model.toJSON());
      this.$el.prepend(li);
      // $(li).effect("highlight", {}, 1500);
    },
  });

  // Always clear the autocomleter on click
  $('#autocomplete-input').click(function(){
    $(this).val('');
  });
});