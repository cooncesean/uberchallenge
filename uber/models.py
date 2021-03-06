from uber import db


class Movie(db.Document):
    """
    A normalized movie object. We are going to store the
    bare minimum needed to plot a movie on the map and will
    make API calls back to SF Data to fetch the rest of the
    data when needed. The assumption is that each movie
    `title` is unique.
    """
    title = db.StringField(unique=True)
    geolocation = db.ListField()
    addresses = db.ListField()

    def __unicode__(self):
        return self.title

    def serialize(self):
        " Return a serialized version of the object. "
        return {
            'title': self.title,
            'addy_plus_geo': self._build_addy_plus_geo(),
            'geolocation': self.geolocation,
            'addresses': self.addresses
        }

    def _build_addy_plus_geo(self):
        " Return these values munged together. "
        try:
            return [(self.addresses[idx], val) for idx, val in enumerate(self.geolocation)]
        except:
            pass
        return [(None, val) for val in self.geolocation]

class SearchHistory(db.Document):
    " Allows us to track each user's search history. "
    sessionid = db.StringField(unique=True)
    movies = db.EmbeddedDocumentField('Movie')
