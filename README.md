# App Description
I decided to work on the `SF Movies` challenge. I decided to go with pure jQuery.js on the frontend and Python (flask) on the backend with MongoHQ storing some static geolocated data. The whole thing is hosted on Amazon Elastic Beanstalk.

# Installation
Steps to install and run this project locally.

1. Check out repo.
2. Create virtual environment.
3. Pip install requirements.
4. Use `run_sever` management command to get up and running locally.
5. (Optionally) If you don't have a local MongoDB running, you should be able to hit the production data set by passing the option `-e PRODUCTION` as a command line arg.

```
> git clone git@github.com:cooncesean/uberchallenge.git
> mkvirtualenv coonce-uberchallenge
> cd uber
> pip install -r requirements.txt
> python manage.py --help # for a list of mgt commands
```

# Scope
As for the

# Testing
To test this app, please use the management command `run_tests` with the option `-e TEST`.

```
> workon <venv>
> cd uber
> python manage.py run_tests -e TEST
```
Views and models are fairly well covered.

# Stack Experience
I'm much for familiar with Django and just started working with Flask earlier this week but have really gotten into - its perfect projects like this. As its such a loose framework,  I'm still trying to figure out the most logical way to structure my projects -- and this seems to work for now.

I have no Backbone.js experience aside from watching a presentation of it at DjangoCon 2012, so I ventured down that path for about an hour before deciding to get to work doing something I'm a bit more versed in. That said, I'm not super proud of the Javascript I've written. Yes, its inline; yes, it uses a few globals; yes, it doesn't really use any MVC patterns like Backbone ....

I've never worked with the Google Maps API (though I do have some experience with `gdata`) and I have never touched the SF Data API. So this was all quite an adventure.

## Storage
Mongo ... I decided to use Mongo because frankly, that's the

# TODO
The app itself seems kinda ... boring. It doesn't really do a whole lot. Given more time, I would have like to completed the "search history" UI and refactor the geolocation+address data to couple those fields for display purposes.

It sounds like you guys are really digging on Backbone and as this was my first time interacting with it, I would love to have some time to read up on it and test it out on some smaller projects before refactoring the front-end js.

# Overall Experience
I felt like I spent the first hour or so researching how to use and query the

