from flask import render_template
from uber import application
from uber.models import Movie, SearchHistory


@application.route('/')
def index():
    " Renders the defaualt page for the app. "
    context = {
        'GOOGLE_MAP_API_KEY': application.config.get('GOOGLE_MAP_API_KEY'),
        'movies': Movie.objects.all(),
    }
    return render_template('index.html', **context)
