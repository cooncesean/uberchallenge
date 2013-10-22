"""
App loader for ElasticBeanstalk. Amazon expects the app
to be loaded from `project.application.py` through the
use of the `application` var instead of `app`.
"""
import uber

application = uber.create_application('PRODUCTION')

if __name__ == '__main__':
    application.run(debug=application.debug)
