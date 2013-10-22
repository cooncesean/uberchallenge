from flask import render_template, make_response, jsonify, request
from uber import application
from uber.models import Movie

@application.route('/')
def index():
    " Renders the defaualt page for the app. "
    context = {
        'GOOGLE_MAP_API_KEY': application.config.get('GOOGLE_MAP_API_KEY'),
        'movies': Movie.objects.all(),
    }
    return render_template('index.html', **context)

@application.route('/api/movies/', methods=['GET'])
def movies():
    " Provide a RESTful end point for the list view of all Movies. "
    # Optionally filter the request
    if 'term' in request.args:
        return jsonify({'movies': [m.serialize() for m in Movie.objects.filter(title__icontains=request.args.get('term'))]})
    return jsonify({'movies': [m.serialize() for m in Movie.objects.all()]})

@application.route('/api/movies/<string:movie_title>/', methods=['GET'])
def movie(movie_title):
    " Provide a RESTful end point for a specific Movie. "
    movie = Movie.objects.get_or_404(title=movie_title)
    return jsonify({'movie': movie.serialize()})

@application.errorhandler(404)
def not_found(error):
    " API error handling. "
    return make_response(jsonify( { 'error': 'Not found' } ), 404)
