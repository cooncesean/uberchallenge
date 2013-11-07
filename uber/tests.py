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
        self.assertEquals(movie._build_addy_plus_geo(), [{'address': '123 Bar Street.', 'geo': {'lat': 12.23, 'lng': 55.1}}])

    def test_irregular_movie_build_addy_plus_geo(self):
        " Assert the `Movie._build_addy_plus_geo()` handles irregular data. "
        # Create a movie w/ irregular geolocation data
        movie = self.create_movie(
            'Foo',
            [{'lat': 12.23, 'lng': 55.1}, {'lat': 11.1, 'lng': 95.1}],
            ['123 Bar Street.', ]
        )
        self.assertEquals(movie._build_addy_plus_geo(), [{'address': None, 'geo': {'lat': 12.23, 'lng': 55.1}}, {'address': None, 'geo': {'lat': 11.1, 'lng': 95.1}}])

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
        response = self.app.open(url_for('movie_api'))
        self.assertEquals(response.status_code, 200)
        assert 'application/json' in response.content_type

        # Load the data and assert that are created movie is in the payload
        data = json.loads(response.get_data())
        assert movie.title in [rec['title'] for rec in data]

    def test_movie_endpoint(self):
        " Test the singular 'movie' endpoint. "
        # Create a movie w/ title 'Foo'
        movie = self.create_movie(
            'Foo',
            [{'lat': 12.23, 'lng': 55.1}],
            ['123 Bar Street.', ]
        )
        response = self.app.open(url_for('movie_api', movie_id=str(movie.id)))

        # Assert we found the movie we were looking for
        self.assertEquals(response.status_code, 200)
        data = json.loads(response.get_data())
        self.assertEquals(movie.title, data['title'])

    def test_invalid_movie_endpoint(self):
        " Test a request to a 'movie' that does not exist. "
        response = self.app.open(url_for('movie_api', movie_id='invalid_id'))

        # Assert that an invalid movie id raises a 404
        self.assertEquals(response.status_code, 404)

    def test_post_movie_returns_405(self):
        " Assert that a POST request to the movies endpoint returns a MethodNotAllowed exception. "
        response = self.app.post(url_for('movie_api'))
        self.assertEquals(response.status_code, 405)

    def test_put_movie_raises_not_implemented(self):
        " Assert that a PUT request to a movie endpoint a MethodNotAllowed exception. "
        movie = self.create_movie(
            'Foo',
            [{'lat': 12.23, 'lng': 55.1}],
            ['123 Bar Street.', ]
        )
        response = self.app.put(url_for('movie_api', movie_id=str(movie.id)))
        self.assertEquals(response.status_code, 405)

    def test_delete_movie_raises_not_implemented(self):
        " Assert that a DELETE request to a movie endpoint a MethodNotAllowed exception. "
        movie = self.create_movie(
            'Foo',
            [{'lat': 12.23, 'lng': 55.1}],
            ['123 Bar Street.', ]
        )
        response = self.app.delete(url_for('movie_api', movie_id=str(movie.id)))
        self.assertEquals(response.status_code, 405)

if __name__ == '__main__':
    unittest.main()
