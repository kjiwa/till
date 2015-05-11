"""till"""

import bottle
import craigslist
import csv
import gflags
import logging
import sys
import StringIO

FLAGS = gflags.FLAGS

gflags.DEFINE_integer('port', '8080', 'The port to listen on.')


@bottle.route('/')
def html():
  return bottle.static_file('till.html', '.')


@bottle.route('/till.css')
def css():
  return bottle.static_file('till_combined.css', 'compiled')


@bottle.route('/till.js')
def js():
  return bottle.static_file('app_combined.js', 'compiled')


@bottle.route('/_/ping')
def ping():
  return bottle.HTTPResponse(status=204)


@bottle.route('/_/list-autos')
def list_autos():
  """Queries Craigslist and returns the result as a CSV.

  Returns:
    A CSV string with mileage, price, and year data for a set of vehicles.
  """

  # Execute the query.
  city = bottle.request.query.city
  query = bottle.request.query.query
  if not city or not query:
    raise bottle.HTTPError(400, 'A city and query are required.')

  result = craigslist.list_autos(city, query)

  # Format as CSV.
  out = StringIO.StringIO()
  writer = csv.writer(out)
  writer.writerow(['Mileage', 'Price', 'Year'])
  for i in result:
    writer.writerow([i.mileage, i.price, i.year])

  content = out.getvalue().decode().strip()
  out.close()

  bottle.response.content_type = 'text/csv'
  return content


def main(argv):
  logging.basicConfig(level=logging.DEBUG)

  try:
    argv = FLAGS(argv)
  except gflags.FlagsError, e:
    print '%s\\nUsage: %s ARGS\\n%s' % (e, sys.argv[0], FLAGS)
    sys.exit(1)

  bottle.run(host='0.0.0.0', port=FLAGS.port)


if __name__ == '__main__':
  main(sys.argv)
