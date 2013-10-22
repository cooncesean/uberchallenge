env = None
db = None
application = None

def create_application(default_env='DEVELOPMENT'):
    """
    Util method to create a fully configured `Flask app` for
    production/development/testing envs. We set all config'd objects
    as globals so they can be imported at the module level.
    """
    from flask import Flask
    from flask_environments import Environments
    from flask.ext.mongoengine import MongoEngine

    global application
    global env
    global db

    # Instatiate the app and the environment
    application = Flask(__name__)
    env = Environments(application, default_env=default_env)
    env.from_object('uber.config')

    # Instantiate the mongo connection
    db = MongoEngine(application)

    # Import and route all views
    from uber.views import *

    return application
