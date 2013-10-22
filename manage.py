"""
Note the `env` option  allows the user to specify the
appropriate config class when running a command. If no
`-e` option is specified, the default environment will be
`uber.config.Development`.

Usage:
    # Run the `bootstrap` command using the `Test` config
    > python manage.py bootstrap -e TEST
"""
import unittest
from flask.ext.script import Manager, Server
from uber import create_application

# Create the application w/ the specified environment
manager = Manager(create_application)
manager.add_option('-e', '--env', dest='default_env', required=False)

# Turn on debugger and reloader
manager.add_command("runserver", Server(
    use_debugger = True,
    use_reloader = True,
    host = '0.0.0.0')
)

@manager.command
def bootstrap():
    """
    Flush the data store and load a fresh set of data; return
    the site a sane default start state.
    """
    from uber.utils import flush_database, generate_dev_data

    # Flush the database and load data
    flush_database()
    generate_dev_data()

@manager.command
def run_tests():
    " Run the test suite. "
    from uber.tests import TestModels, TestViews
    suite = unittest.TestLoader().loadTestsFromTestCase(TestModels)
    suite.addTest(unittest.TestLoader().loadTestsFromTestCase(TestViews))
    unittest.TextTestRunner(verbosity=2).run(suite)

if __name__ == "__main__":
    manager.run()
