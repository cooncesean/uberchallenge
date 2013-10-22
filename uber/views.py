from flask import render_template
from uber import application


@application.route('/')
def index():
    " Renders the defaualt page for the app. "
    context = {
        'GOOGLE_MAP_API_KEY': application.config.get('GOOGLE_MAP_API_KEY'),
        'SF_DATA_API_BASE_URL': application.config.get('SF_DATA_API_BASE_URL'),
    }
    return render_template('index.html')
