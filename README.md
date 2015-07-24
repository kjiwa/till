# Till

[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

Till is a research tool that scrapes data from automobiles on sale on Craigslist
and renders the data in some charts. It is slow, but it generates some
interesting data.

The CSS and JS are compiled with
[Closure Tools](https://developers.google.com/closure/). Instead of including a
build script, I included precompiled versions in the repository. I'll leave it
as an exercise to compile them yourself.

A script, ```run.sh```, is included that will create a virtualenv environment
and run the server within it.

![ScreenShot](https://raw.github.com/kjiwa/till/master/till-201405120216.png)
