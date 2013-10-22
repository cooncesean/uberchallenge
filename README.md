# App Description
I decided to work on the `SF Movies` challenge and built a simple app called 'Fog City Flicks' which [can be found here](http://www.fogcityflicks.com) (alternatively [here](http://uber-env-gx6emjwcqm.elasticbeanstalk.com/) if DNS is still propogating). I decided to go with pure jQuery.js on the frontend, Python (flask) on the backend amd using MongoHQ storing some static geolocated data. The whole thing is hosted on [Amazon Elastic Beanstalk](http://aws.amazon.com/elasticbeanstalk/).

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
The views and models found in the project are fairly well covered.


# Stack Experience
I'm much for familiar with Django and just started working with Flask earlier this week but have really gotten into - its perfect projects like this. As its such a loose framework,  I'm still trying to figure out the most logical way to structure my projects -- and this seems to work for now.

I have zero Backbone.js experience and I actually [ventured down its path](https://www.youtube.com/watch?v=FZSjvWtUxYk) for about an hour before deciding to get to work in frameworks I'm a bit more versed in. That said, I'm not super proud of the Javascript that's powering the app - its inline; its probably tough to follow; and it doesn't use any of the MVC patterns found in Backbone. This is due for a major refactor down the line.


# TODO
The app itself seems kinda ... boring - in that it doesn't really do a whole lot. Given more time, I would have like to completed the "search history" UI and refactored the [`Movie` model](https://github.com/cooncesean/uberchallenge/blob/master/uber/models.py#L3) to couple those two fields a bit more closely.

It sounds like you guys are really digging on Backbone and as this was my first time interacting with it, I would love to have some time to read up on it and test it out on some smaller projects before refactoring the front-end js.

# My Overall Experience
I might have had too much RedBull tonight. I rarely get stressed out, but the abruptness of my self imposed deadline had me a bit scattered to be frank.

I felt like I spent the first hour and half going down a few rabbit holes (whether it was trying to grok the SF Data API, wrapping my head around the Google Maps API, or figuring out if I could actually pull off a Backbone solution). Once I settled down and started to make some progress, things started to flow.

This was quite an adventure and I'm glad I powered through - cheers, hit back with any questions.