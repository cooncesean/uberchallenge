import sha
import time
from flask import render_template, session, escape
from uber import application
from uber.models import Movie, SearchHistory
from uber.utils import build_session_id


@application.route('/')
def index():
    " Renders the defaualt page for the app. "
    # Set the session_id for the user
    if application.config.get('SESSION_ID') not in session:
        session[application.config.get('SESSION_ID')] = build_session_id()

    # Get the search history for the current user
    SearchHistory.objects.filter(sessionid=session[application.config.get('SESSION_ID')])

    # Set the template context
    context = {
        'GOOGLE_MAP_API_KEY': application.config.get('GOOGLE_MAP_API_KEY'),
        'movies': Movie.objects.all(),
    }
    return render_template('index.html', **context)

def history_add(movie_id):
    " Saves a movie history "