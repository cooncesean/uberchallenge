import json
from flask import render_template, Response
from flask.views import MethodView
from uber import application
from uber.models import Movie


@application.route('/')
def index():
    " Renders the defaualt page for the app. "
    context = {
        'GOOGLE_MAP_API_KEY': application.config.get('GOOGLE_MAP_API_KEY'),
        # 'movies': Movie.objects.all(),
    }
    return render_template('index.html', **context)

class MovieAPI(MethodView):
    """
    Provide a RESTful api to manipulate `models.Movie` resources. Note that
    we are currently not exposing POST, PUT, or DELETE methods for this model.
    """
    def get(self, movie_id):
        " Handle an `http.GET` request to either fetch a list of movies or a single movie. "
        # If `movie_id` is not passed, return the full list of movies
        if movie_id is None:
            return Response(
                json.dumps([m.serialize() for m in Movie.objects.all()]),
                mimetype='application/json'
            )

        # Expose a single movie
        else:
            m = Movie.objects.get(id=movie_id)
            return Response(json.dumps(m.serialize()), mimetype='application/json')

    def post(self):
        " Create a new movie obj. "
        raise NotImplementedError

    def delete(self, movie_id):
        " Delete a single movie. "
        raise NotImplementedError

    def put(self, movie_id):
        " Update a single movie. "
        raise NotImplementedError

# Register the url patterns
movie_api = MovieAPI.as_view('movie_api')
application.add_url_rule(
    '/movies/',
    defaults={'movie_id': None},
    view_func=movie_api,
    methods=['GET',]
)
application.add_url_rule(
    '/movies/<string:movie_id>/',
    view_func=movie_api,
    methods=['GET', ]#'PUT', 'DELETE']
)
# application.add_url_rule(
#     '/movies/',
#     view_func=movie_api,
#     methods=['POST',]
# )
