# Till

Till is a research tool that scrapes data from automobiles on sale on Craigslist
and renders the data in some charts.

The CSS and JS are compiled with
[Closure Tools](https://developers.google.com/closure/). Instead of including a
build script, I included precompiled versions in the repository. I'll leave it
as an exercise to compile them yourself.

The included build script creates an executable and will optionally run it in a
virtualenv environment. e.g.

```
./build.sh -- --port=33080
Bottle v0.13-dev server starting up (using WSGIRefServer())...
Listening on http://0.0.0.0:33080/
Hit Ctrl-C to quit.

127.0.0.1 - - [10/May/2015 20:38:46] "GET / HTTP/1.1" 200 324
127.0.0.1 - - [10/May/2015 20:38:46] "GET /till.css HTTP/1.1" 200 44941
127.0.0.1 - - [10/May/2015 20:38:46] "GET /till.js HTTP/1.1" 200 6479
```

![ScreenShot](https://raw.github.com/kjiwa/till/master/till-201405120216.png)
