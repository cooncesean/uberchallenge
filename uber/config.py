"""
This file is used in conjuction with `flask-environments`
to correctly configure the app with development/prod/testing
settings.

http://pythonhosted.org/Flask-Environments/
"""
PROJECT_NAME = __name__.split('.')[0]
class Config(object):
    SECRET_KEY = 'rt3V94Azhr992j3yXRXHHjmJAW'
    GOOGLE_MAP_API_KEY = 'AIzaSyDujjdLWyq-NSiAWdkc0FAXgfDB8NXybLk'
    SF_DATA_API_BASE_URL = 'http://data.sfgov.org/resource/yitu-d5am.json'
    GOOGLE_MAPS_GEOCODE_URL = 'http://maps.googleapis.com/maps/api/geocode/json'
    SESSION_ID = 'sessionid'
    DEBUG = False
    TESTING = False

class Production(Config):
    " Configuration for the `production` environment. "
    MONGODB_SETTINGS = {
        'db': '%s' % PROJECT_NAME,
        'username': 'uber',
        'password': 'KvzLK8JPn6tsye',
        'host': 'mongodb://uber:KvzLK8JPn6tsye@paulo.mongohq.com:10095/uber',
        'port': 10095
    }

class Development(Config):
    " Configuration for a `development` environment. "
    DEBUG = True
    MONGODB_SETTINGS = {
        'db': '%s_development_db' % PROJECT_NAME,
    }

class Test(Config):
    " Configuration for the `test` environment. "
    DEBUG = True
    TESTING = True
    MONGODB_SETTINGS = {
        'db': '%s_test_db' % PROJECT_NAME,
    }
    TESTING = True
