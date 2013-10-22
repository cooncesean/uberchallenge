from flask import render_template, make_response, jsonify
from uber import application
from uber.models import Movie


@application.route('/')
def index():
    " Renders the defaualt page for the app. "
    context = {
        'GOOGLE_MAP_API_KEY': application.config.get('GOOGLE_MAP_API_KEY'),
        'SF_DATA_API_BASE_URL': application.config.get('SF_DATA_API_BASE_URL'),
        'movies': Movie.objects.all(),
    }
    return render_template('index.html', **context)

@application.route('/api/movies.json', methods=['GET'])
def movies():
    " Provide a RESTful api for the Movie model. "
    return jsonify({'movies': [m.serialize() for m in Movie.objects.all()]})

@application.errorhandler(404)
def not_found(error):
    " API error handling. "
    return make_response(jsonify( { 'error': 'Not found' } ), 404)
