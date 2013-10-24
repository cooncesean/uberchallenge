$(function(){
  // Note that the `Movie` model and `movies` collection
  // are declared in `index.html` for bootstrapping purposes.

  // EVENT AGGREGATOR /////////////////////////////////////////////////////////
  //   Global Events:
  //    1. `autocompleteSelected`: Fired when a selection has been made from the
  //        the #autocompleter-input. The `MovieInfoView` and `MapView` both
  //        listen to this event and update themselves accordingly.
  //    2. `searchHistorySelected`: Fired when a item in the `selectedMovieHistory`
  //        has been clicked. The `MovieInfoView` and `MapView` both listen to this
  //        event and update themselves accordingly.
  /////////////////////////////////////////////////////////////////////////////
  Backbone.pubSub = _.extend({}, Backbone.Events);

  // COLLECTIONS //////////////////////////////////////////////////////////////
  var SelectedMovieHistory = Backbone.Collection.extend({
    model: Movie
  });
  var selectedMovieHistory = new SelectedMovieHistory();

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

          // Add the `movie` to the `selectedMovieHistory` collection
          // if it doesn't already exist
          if(! selectedMovieHistory.findWhere({'title': movie.title})){
            selectedMovieHistory.add(movie);
          }

          // Fire the `autocompleteSelected` event
          Backbone.pubSub.trigger('autocompleteSelected', movie);
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
      // Subscribe to the `movieSelected` event (triggered from the `SearchHistoryItemView`)
      Backbone.pubSub.on('autocompleteSelected', this.updateMap, this);
      Backbone.pubSub.on('searchHistorySelected', this.updateMap, this);

      // Google map config
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
        self.createMarkersForMovie(this);
      });
    },

    // Create a new markers on the map for each lat/lng in `movie` objects
    // `addy_plus_geo` list.
    createMarkersForMovie: function(movie){
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

    // Update the markers on the map w/ those of a selected `movie`
    updateMap: function(movie){
      // Delete all of the existing markers
      this.deleteMarkers();

      // Create new markers for only this location
      this.createMarkersForMovie(movie);
    }
  });
  var mapView = new MapView;

  // MOVIE INFO  //////////////////////////////////////////////////////////////
  //   Manages UI regarding the movie info and locations on the sidebar (under
  //   the autocompleter), once a movie is selected.
  /////////////////////////////////////////////////////////////////////////////
  var MovieInfoView = Backbone.View.extend({
    el: $("#selected-movie-info"),
    tagName: 'div',
    template: _.template($('#movie-info-template').html()),

    initialize: function(){
      // Subscribe to the `movieSelected` event (triggered from the `SearchHistoryItemView`)
      Backbone.pubSub.on('autocompleteSelected', this.render, this);
      Backbone.pubSub.on('searchHistorySelected', this.render, this);
    },

    render: function(movie){
      this.$el.html(this.template(movie.toJSON()));
    },
  });
  var movieInfo = new MovieInfoView();

  // SELECTED MOVIE HISTORY ///////////////////////////////////////////////////
  //   Manages the `history` <ul> and updates it whenever a user selects a new
  //   movie from the autocompleter.
  //   The two following views follow a design pattern found here:
  //   http://lostechies.com/derickbailey/2011/10/11/backbone-js-getting-the-model-for-a-clicked-element/
  //
  //   Essentially the `SearchHistoryListView` mananages a list of `SearchHistoryItemView`
  //   views which in turn manage single `Movie` model instances in the user's
  //   search history. The `SearchHistoryItemView` is responsible for rendering
  //   and event handling on a single `Movie` in the history while the list view
  //   is responsible for rendering the entire list of objects in the collection.
  /////////////////////////////////////////////////////////////////////////////
  SearchHistoryListView = Backbone.View.extend({
      el: $("ul#history"),
      tagName: "ul",

      initialize: function(){
          _.bindAll(this, "renderItem");
          this.listenTo(this.collection, 'add', this.render);
      },

      renderItem: function(model){
          var itemView = new SearchHistoryItemView({model: model});
          itemView.render();
          $(this.el).append(itemView.el);
      },

      render: function(){
          this.$el.empty();
          this.collection.each(this.renderItem);
      }
  });

  SearchHistoryItemView = Backbone.View.extend({
      tagName: "li",
      template: _.template($('#searchhistory-item-template').html()),
      events: {
          "click a": "clicked"
      },

      clicked: function(e){
          e.preventDefault();
          Backbone.pubSub.trigger('searchHistorySelected', this.model);
      },

      render: function(){
          var html = this.template(this.model.toJSON());
          $(this.el).append(html);
      }
  });
  var searchHistoryList = new SearchHistoryListView({collection: selectedMovieHistory});

  // Always clear the autocomleter on click
  $('#autocomplete-input').click(function(){
    $(this).val('');
  });
});