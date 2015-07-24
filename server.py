"""An automobile price research tool."""

import bottle
import craigslist
import json

APP = bottle.default_app()


@bottle.route('/')
def html():
  return bottle.static_file('till.html', '.')


@bottle.route('/till.css')
def css():
  return bottle.static_file('till_combined.css', 'compiled')


@bottle.route('/till.js')
def js():
  return bottle.static_file('app_combined.js', 'compiled')


@bottle.route('/ping')
def ping():
  return bottle.HTTPResponse(status=204)


@bottle.route('/automobiles/<city>/<query>')
def automobiles(city, query):
  """Queries Craigslist for automobiles.

  Args:
    city: The city in which to search.
    query: The search query to be executed.

  Returns:
    A JSON-encoded array of vehicles.
  """
  result = craigslist.automobiles(city, query)
  content = [{'mileage': i.mileage, 'price': i.price, 'year': i.year}
             for i in result]

  bottle.response.content_type = 'application/json'
  return json.dumps({'automobiles': content})


@bottle.route('/cities')
def cities():
  """Gets a list of cities that can be queried.

  Returns:
    A list of city names.
  """
  result = craigslist.cities()
  content = [{'city_id': i.city_id, 'name': i.name} for i in result]

  bottle.response.content_type = 'application/json'
  return json.dumps({'cities': content})
