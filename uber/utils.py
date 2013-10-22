import inspect
import json
import urllib
import urllib2
from uber import db, application, models


def generate_dev_data():
    " Generates a handful of dev data to bootstrap the site. "
    SF_DATA_API_BASE_URL = application.config.get('SF_DATA_API_BASE_URL')
    GOOGLE_MAPS_GEOCODE_URL = application.config.get('GOOGLE_MAPS_GEOCODE_URL')

    # Use the SF Data API to fetch the title and location of each movie
    # in its db.
    encoded_args = urllib.urlencode({'$select':'title, locations'})
    sf_url = '%s?%s' % (SF_DATA_API_BASE_URL, encoded_args)
    print 'Fetching Film Data: %s...' % sf_url
    response = urllib2.urlopen(sf_url)
    movie_records = json.load(response)

    # The returned payload should look something like this:
    # [{'title': 'Zodiac', 'locations': '2210 Broadway St.'}, ...]
    #
    # Iterate over each record and get/create a Movie object based
    # on title, then try to geocode the each location
    for rec in movie_records:
        title = rec['title']
        movie, _ = models.Movie.objects.get_or_create(title=title)
        location = rec.get('locations', None)

        # Handle null location data
        if location is None:
            continue

        movie.addresses.append(location)

        # Attempt to geocode this location
        sf_location_string = '%s, San Francisco, CA' % location
        try:
            encoded_args = urllib.urlencode({'address': sf_location_string, 'sensor': 'false'})
        # Deal w/ unicode later
        except UnicodeEncodeError:
            continue

        maps_url = '%s?%s' % (GOOGLE_MAPS_GEOCODE_URL, encoded_args)
        response = urllib2.urlopen(maps_url)
        geo_data = json.load(response)
        results = geo_data['results']

        # Handle invalid response
        if len(results) == 0:
            continue

        # Update the movie's `geolocation`
        result = results[0]
        movie.geolocation.append(result.get('geometry', {}).get('location', {}))
        movie.save()

def flush_database():
    " This is ghetto ... there must be a mongoengine call to flush the db. "
    print 'Flushing database....'
    for name, cls in inspect.getmembers(models, inspect.isclass):
        if issubclass(cls, db.Document):
            cls.objects.all().delete()
