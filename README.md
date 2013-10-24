# App Description
I decided to work on the `SF Movies` challenge and built a simple app called 'Fog City Flicks' which [can be found here](http://www.fogcityflicks.com) (alternatively [here](http://uber-env-gx6emjwcqm.elasticbeanstalk.com/) if DNS is still propogating). I decided to go with ~~pure jQuery.js on the frontend~~ ([there is now a fully refactored Backbone solution here](https://github.com/cooncesean/uberchallenge/tree/backbone)), Python (flask) on the backend and MongoDB to store some geolocated data. The whole thing is hosted on [Amazon's Elastic Beanstalk](http://aws.amazon.com/elasticbeanstalk/).

# Installation
Steps to install and run this project locally.

1. Check out the repo.
2. Create your virtual environment.
3. Pip install requirements.
4. Use the `run_sever` management command to get up and running locally.
5. (Optionally) If you don't have a local Mongo instance running, you should be able to hit the production data set by passing the option `-e PRODUCTION` as a command line arg.

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
**Update:** The app has now been [fully refactored](https://github.com/cooncesean/uberchallenge/tree/backbone) (and greatly simplified) using Backbone on the frontend.

I'm more familiar with Django and have only recently started working with Flask. That said, I am really digging its flexibility and have found that its perfect projects like this. As its such a 'loose' framework,  I'm still trying to figure out the most logical way to structure my projects -- and this seems to work for now.

I had zero Backbone.js experience and I actually [ventured down this path](https://www.youtube.com/watch?v=FZSjvWtUxYk) for about an hour before deciding to get to work using conventions I'm more familiar with. That said, I wasn't super happy with the Javascript that was powering the app -- [so I decided to create a branch to start refactoring this logic using Backbone](https://github.com/cooncesean/uberchallenge/tree/backbone). I know its passed the 'deadline'... I'm just interested in learning more about it and this seemed like a nice opportunity to do so.



# TODO

### Refactor
The app itself is (hopefully) straightforward to use, but it doesn't really do a whole lot. Given more time, I would have like to ~~completed the "search history" UI~~ ([done here](https://github.com/cooncesean/uberchallenge/commit/7f3a3ab20c06913367753d74bae762d118ad8847)) and refactored the [`Movie`](https://github.com/cooncesean/uberchallenge/blob/master/uber/models.py#L3) model to couple the `address` and `geolocation` fields more tightly.

### Static Files
I would also like to serve my static files from s3; I haven't found a great way to accomplish that yet with Beanstalk + Flask but its on my radar.

### Periodic Tasks To Fetch API Listings
The movie data from the API is loaded via the [`uber.utils.generate_dev_data()`](https://github.com/cooncesean/uberchallenge/blob/master/uber/utils.py#L7) function. This logic should be either run as a cron job or a periodic task to fetch fresh data.


# My Overall Experience
I felt like I spent the first hour and half going down a few rabbit holes (whether it was trying to grok the SF Data API, wrapping my head around the Google Maps API, or figuring out if I could actually pull off a Backbone solution) before I settled in on a UI and narrowed the scope of the project. Once I got in the groove and made a bit of progress, things started to flow.

This was quite the adventure and I'm glad I powered through. Please hit back with any questions.
