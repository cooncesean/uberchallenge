# App Description
I decided to work on the `SF Movies` challenge and built a simple app called 'Fog City Flicks' which [can be found here](http://www.fogcityflicks.com) (alternatively [here](http://uber-env-gx6emjwcqm.elasticbeanstalk.com/) if DNS is still propogating). I decided to go with pure jQuery.js on the frontend, Python (flask) on the backend and MongoDB to store some geolocated data. The whole thing is hosted on [Amazon Elastic Beanstalk](http://aws.amazon.com/elasticbeanstalk/).

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

# Testing
To test this app, use the management command `run_tests` with the option `-e TEST`.

```
> workon coonce-uberchallenge
> cd uber
> python manage.py run_tests -e TEST
```

The views and models found in the project have reasonable coverage.


# Stack Experience
I'm more familiar with Django and have only recently started working with Flask. That said, I am really digging its flexibility and its perfect projects like this. As its such a 'loose' framework,  I'm still trying to figure out the most logical way to structure my projects -- and this seems to work for now.

I have zero Backbone.js experience and I actually [ventured down its path](https://www.youtube.com/watch?v=FZSjvWtUxYk) for about an hour before deciding to get to work using frameworks I'm more familiar with. That said, I'm not super proud of the Javascript that's powering this app - its inline; its probably tough to follow; and it doesn't leverage any of the MVC patterns found in Backbone. The front-end is due for a major refactor down the line.


# TODO
The app itself is (hopefully) straightforward, but it doesn't really do a whole lot. Given more time, I would have like to completed the "search history" UI and refactored the [`Movie` model](https://github.com/cooncesean/uberchallenge/blob/master/uber/models.py#L3) to couple the `address` and `geolocation` fields more closely.


# My Overall Experience
I felt like I spent the first hour and half going down a few rabbit holes (whether it was trying to grok the SF Data API, wrapping my head around the Google Maps API, or figuring out if I could actually pull off a Backbone solution) before I settled in on a UI and narrowed the scope of the project. Once I got in the groove and made a little bit of progress, things started to flow.

This was quite an adventure and I'm glad I powered through. Hit back with any questions.
