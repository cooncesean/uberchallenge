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
    DEBUG = False
    TESTING = False

class Production(Config):
    " Configuration for the `production` environment. "
    pass

class Development(Config):
    " Configuration for a `development` environment. "
    DEBUG = True

class Test(Config):
    " Configuration for the `test` environment. "
    DEBUG = True
    TESTING = True
