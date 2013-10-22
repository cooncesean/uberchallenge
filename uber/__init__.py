env = None
application = None

def create_application(default_env='DEVELOPMENT'):
    """
    Util method to create a fully configured `Flask app` for
    production/development/testing envs. We set all config'd objects
    as globals so they can be imported at the module level.
    """
    from flask import Flask
    from flask_environments import Environments

    global application
    global env

    # Instatiate the app and the environment
    application = Flask(__name__)
    env = Environments(application, default_env=default_env)
    env.from_object('uber.config')

    # Import and route all views
    from uber.views import *

    return application
