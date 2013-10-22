import unittest
from uber import application
from uber.models import Movie
from uber.utils import flush_database


class UberChallengeTestCase(unittest.TestCase):
    " Unit tests for the `uber` project. "
    def setUp(self):
        self.app = application.test_client()

    def tearDown(self):
        flush_database()

class TestModels(UberChallengeTestCase):
    " Model unit tests. "

    def test_normal_movie_build_addy_plus_geo(self):
        " Assert the `Movie._build_addy_plus_geo()` returns the expected list with normal data. "
        movie = Movie.objects.create(
            title='Foo',
            geolocation=[{'lat': 12.23, 'lng': 55.1}],
            addresses=['123 Bar Street.', ]
        )
        self.assertEquals(movie._build_addy_plus_geo(), [('123 Bar Street.', {'lat': 12.23, 'lng': 55.1})])

    def test_irregular_movie_build_addy_plus_geo(self):
        " Assert the `Movie._build_addy_plus_geo()` handles irregular data. "
        movie = Movie.objects.create(
            title='Foo',
            geolocation=[{'lat': 12.23, 'lng': 55.1}, {'lat': 11.1, 'lng': 95.1}],
            addresses=['123 Bar Street.', ]
        )
        self.assertEquals(movie._build_addy_plus_geo(), [(None, {'lat': 12.23, 'lng': 55.1}), (None, {'lat': 11.1, 'lng': 95.1})])

if __name__ == '__main__':
    unittest.main()
