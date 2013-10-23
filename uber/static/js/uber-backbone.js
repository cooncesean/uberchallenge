$(function(){
  // Note that the `MovieLocation` model and `movieLocations` collection
  // are declared in `index.html` for bootstrapping purposes.

  // MODELS/COLLECTIONS ///////////////////////////////////////////////////////
  var AutoCompleteResult = Backbone.Model.extend({
    defaults: function(){
      return {
        title: "",
      };
    }
  })
  var AutoCompleteResultList = Backbone.Collection.extend({
    model: AutoCompleteResult,
  });
  var autoCompleteResults = new AutoCompleteResultList();
  var SelectedMoviesList = Backbone.Collection.extend({
    model: MovieLocation
  });


  // AUTOCOMPLETE-RESULT VIEW /////////////////////////////////////////////////
  //   Manages single result Model instances (`AutoCompleteResult`)
  //   for returned async results from the auto-completer. It manages the
  //   creation and rendering if <li> elements appended to the
  //   <ul id='autocomplete-result-container'>.
  /////////////////////////////////////////////////////////////////////////////
  var AutoCompleteResultView = Backbone.View.extend({
    tagName: 'li',
    template: _.template($('#autocomplete-result').html()),
    model: AutoCompleteResult,

    render: function(){
      var tpl = this.$el.html(this.template(this.model.toJSON()));
      return tpl;
    },

    clear: function() {
      this.model.destroy();
    }
  });

  // AUTOCOMPLETE-INPUT VIEW //////////////////////////////////////////////////
  //   Manages input to the `#autocomplete-input` as well as updating the
  //   response <ul> container.
  /////////////////////////////////////////////////////////////////////////////
  var AutoCompleteInputView = Backbone.View.extend({
    el: $('#autocomplete-input'),
    events: {
      "keypress": "handleKeyPress",
    },

    // Handle key presses in the `#autocomplete-input`
    handleKeyPress: function(){
      var self = this;
      var query = this.$el.val();
      if(query.length < 2)
        return;

      // Make an async call to fetch any possible `Movie` matches
      $.ajax({
        url: urlMovies + "?term=" + encodeURIComponent(query),
        dataType: "json",
        type: "get",

        success: function (data) {
          // Remove existing elements from the result <ul> and reset the collection
          var resultContainer = $("ul#autocomplete-result-container");
          resultContainer.removeClass('dn');
          resultContainer.empty();
          self.collection.reset();

          // Iterate over each async result and instantiate a new
          // AutoCompleteResult obj then append it to the collection
          // and append the rendered `AutoCompleteResultView` template
          // to the <ul> container.
          $.map(data['movies'], function(item) {
            var model = new AutoCompleteResult({title: item.title});
            // console.log(model.get('title'))
            var view = new AutoCompleteResultView({model: model});

            self.collection.add(model);
            resultContainer.append(view.render());
          });
        }
      });
    }
  });
  var autoCompleteInputViewInstance = new AutoCompleteInputView({
    collection: autoCompleteResults
  });

  // MAPVIEW /////////////////////////////////////////////////////////////////
  //   Manages UI around the single Google Map binding.
  /////////////////////////////////////////////////////////////////////////////
  var MapView = Backbone.View.extend({
    el: $('#map-canvas'),
    markers: [],

    // Init the map on the page, binding it to #map-canvas
    initialize: function() {
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
  var mapViewInstance = new MapView;

  // APPVIEW //////////////////////////////////////////////////////////////////
  // Top level piece of UI. This 'glues' everything (the autocompleter,
  // the selector and the map) together.
  /////////////////////////////////////////////////////////////////////////////
  var AppView = Backbone.View.extend({
    // This is a simple container for everything ... we don't really need to update it
    el: $("#container"),

    // At initialization we bind to the relevant events on the `autocomplete input`
    // Loading any all movie locations from the API.
    initialize: function(mapViewInstance) {
      this.mapViewInstance = mapViewInstance;
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
  var app = new AppView(mapViewInstance);

});