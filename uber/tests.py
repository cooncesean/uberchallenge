import json
import unittest
from flask import url_for
from uber import application
from uber.models import Movie
from uber.utils import flush_database


class UberChallengeTestCase(unittest.TestCase):
    " Unit tests for the `uber` project. "
    def setUp(self):
        self.app = application.test_client()

    def tearDown(self):
        flush_database()

    def create_movie(self, title, geolocation, addresses):
        " Util method to crreate and return a new Movie. "
        return Movie.objects.create(
            title=title,
            geolocation=geolocation,
            addresses=addresses
        )

class TestModels(UberChallengeTestCase):
    " Model unit tests. "
    def test_normal_movie_build_addy_plus_geo(self):
        " Assert the `Movie._build_addy_plus_geo()` returns the expected list with normal data. "
        movie = self.create_movie(
            'Foo',
            [{'lat': 12.23, 'lng': 55.1}],
            ['123 Bar Street.', ]
        )
        self.assertEquals(movie._build_addy_plus_geo(), [('123 Bar Street.', {'lat': 12.23, 'lng': 55.1})])

    def test_irregular_movie_build_addy_plus_geo(self):
        " Assert the `Movie._build_addy_plus_geo()` handles irregular data. "
        # Create a movie w/ irregular geolocation data
        movie = self.create_movie(
            'Foo',
            [{'lat': 12.23, 'lng': 55.1}, {'lat': 11.1, 'lng': 95.1}],
            ['123 Bar Street.', ]
        )
        self.assertEquals(movie._build_addy_plus_geo(), [(None, {'lat': 12.23, 'lng': 55.1}), (None, {'lat': 11.1, 'lng': 95.1})])

class TestViews(UberChallengeTestCase):
    " View unit tests. "
    def test_index(self):
        " Assert that the index view renders without issue. "
        response = self.app.open(url_for('index'))
        self.assertEquals(response.status_code, 200)
        assert 'text/html' in response.content_type

    def test_movies_endpoint(self):
        " Assert that the /movies/ endpoint renders expected Movie data. "
        movie = self.create_movie(
            'Foo',
            [{'lat': 12.23, 'lng': 55.1}],
            ['123 Bar Street.', ]
        )
        response = self.app.open(url_for('movies'))
        self.assertEquals(response.status_code, 200)
        assert 'application/json' in response.content_type

        # Load the data and assert that are created movie is in the payload
        data = json.loads(response.get_data())
        assert movie.title in [rec['title'] for rec in data['movies']]

    def test_movies_with_filter(self):
        " Assert that the /movies/ endpoint renders expected Movie data when a filter is passed. "
        # Create a movie w/ title 'Foo'
        movie = self.create_movie(
            'Foo',
            [{'lat': 12.23, 'lng': 55.1}],
            ['123 Bar Street.', ]
        )
        # Filter the request, looking for 'bar'
        response = self.app.open('%s?term=bar' % url_for('movies'))
        self.assertEquals(response.status_code, 200)
        assert 'application/json' in response.content_type

        # Load the data and assert that nothing is in the payload
        data = json.loads(response.get_data())
        self.assertEquals(len(data['movies']), 0)

    def test_movie_endpoint(self):
        " Test the singular 'movie' endpoint. "
        # Create a movie w/ title 'Foo'
        movie = self.create_movie(
            'Foo',
            [{'lat': 12.23, 'lng': 55.1}],
            ['123 Bar Street.', ]
        )
        response = self.app.open(url_for('movie', movie_title='Foo'))

        # Assert we found the movie we were looking for
        self.assertEquals(response.status_code, 200)
        data = json.loads(response.get_data())
        self.assertEquals(movie.title, data['movie']['title'])

if __name__ == '__main__':
    unittest.main()
