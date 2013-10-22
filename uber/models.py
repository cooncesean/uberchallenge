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

    @property
    def format_info(self):
        " Return a info about the movie formatted for the `infoWindow()` on the map."
        return "<p>%(title)s</p>" % {
            'title': self.title
        }

    def serialize(self):
        " Return a serialized version of the object. "
        return {
            'title': self.title,
            'geolocation': self.geolocation,
            'addresses': self.addresses
        }
