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
    from raven.contrib.flask import Sentry

    global application
    global env
    global db

    # Instatiate the app and the environment
    application = Flask(__name__)
    env = Environments(application, default_env=default_env)
    env.from_object('uber.config')

    # Instantiate the mongo connection
    db = MongoEngine(application)

    # Configure Sentry/error logging
    sentry = Sentry(
        application,
        dsn='https://cf84591bc153450c9a0ca18e35616d5d:3c1ec9c846da43dbb2981f8ce6a1e7db@app.getsentry.com/4404'
    )

    # Import and route all views
    from uber.views import index

    return application
