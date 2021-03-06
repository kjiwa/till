"""craigslist client."""

import collections
import logging
import re
import threading
import urllib.parse
import urllib.request
import lxml.etree

Automobile = collections.namedtuple('Automobile', ['mileage', 'price', 'year'])

City = collections.namedtuple('City', ['city_id', 'name'])


def automobiles(city, query):
  """Query automobiles.

  Args:
    city: The city to search.
    query: An optional phrase to search for.

  Returns:
    A list of matching Automobiles.
  """
  result = []
  for i in range(0, 10):
    autos = _list_autos(city.lower(), query.lower(), i)
    result_len = len(result)

    threads = []
    for j in autos:
      thread = threading.Thread(target=_get_auto_thread,
                                args=(city, j, result))
      thread.start()
      threads.append(thread)

    for thread in threads:
      thread.join()

    logging.info('Found %d automobiles after %d pages.', len(result), i + 1)
    if result_len == len(result):
      logging.info('No more results were found. Ceasing crawl.')
      break

  logging.info('Found %d automobiles total.', len(result))
  return result


def cities():
  """Gets a list of supported cities.

  Returns:
    A list of supported cities.
  """
  return [
      City('atlanta', 'Atlanta'),
      City('chicago', 'Chicago'),
      City('houston', 'Houston'),
      City('seattle', 'Seattle'),
      City('sfbay', 'SF & Bay Area'),
      City('toronto', 'Toronto')
  ]


def _get_auto(city, link):
  """Fetch and extract automobile details.

  Args:
    city: The city to search.
    link: The path portion of the URL to fetch.

  Returns:
    An Automobile object or None if there was a parsing error.
  """
  url = link
  if not (link.startswith('http://') or link.startswith('https://')):
    url = 'https://%s.craigslist.org%s' % (urllib.parse.quote(city),
                                           urllib.parse.quote(link))

  tree = lxml.etree.HTML(_read_url(url))
  if tree is None:
    return None

  elements = tree.xpath('//p[@class="attrgroup"]/span')
  attrs = [
      lxml.etree.tostring(i, encoding='unicode', method='text')
      for i in elements
  ]

  return Automobile(_get_auto_mileage(attrs), _get_auto_price(tree),
                    _get_auto_year(attrs))


def _get_auto_mileage(attrs):
  """Extract mileage from automobile attributes.

  Args:
    attrs: A list of strings containing craigslist attributes.

  Returns:
    A mileage value or None.
  """
  pattern = re.compile(r'odometer:\s*(\d+)\s*')
  for i in attrs:
    match = pattern.match(i)
    if match:
      mileage = int(match.group(1))
      mileage *= 1000 if mileage < 1000 else 1
      return mileage


def _get_auto_price(tree):
  """Extract price from automobile details.

  Args:
    tree: An XML element tree.

  Returns:
    A price value or None.
  """
  pattern = re.compile(r'^\s*\$(\S+)\s*$')
  elements = tree.xpath('//span[@class="price"]')
  for i in elements:
    title = lxml.etree.tostring(i, encoding='unicode', method='text')
    match = pattern.match(title.strip())
    return float(match.group(1).replace(',', '')) if match else None


def _get_auto_year(attrs):
  """Extract year from automobile attributes.

  Args:
    attrs: A list of strings containing craigslist attributes.

  Returns:
    A year value or None.
  """
  pattern = re.compile(r'^\s*(\d+)')
  for i in attrs:
    match = pattern.match(i)
    if match:
      return int(match.group(1))


def _list_autos(city, query, page):
  """Query automobiles starting on page i.

  Args:
    city: The city to search.
    query: An optional search phrase.
    page: The page to query.

  Returns:
    A list of matching Automobile objects.
  """
  qstr = urllib.parse.urlencode({
      'hasPic': 1,
      'auto_make_model': query,
      's': page * 100,
      'srchType': 'T',
      'hints': 'makemodel'
  })

  url = 'https://%s.craigslist.org/d/cars-trucks/search/cta?%s' % (
      urllib.parse.quote(city), qstr)
  tree = lxml.etree.HTML(_read_url(url))
  if tree is not None:
    elements = tree.xpath('//li[@data-pid]/a')
    return [i.attrib.get('href') for i in elements]

  return []


def _read_url(url):
  """Read content from a URL.

  Args:
    url: The URL to fetch.

  Returns:
    A string representing the contents of the URL.
  """
  return urllib.request.urlopen(url).read()


def _get_auto_thread(city, link, result):
  """Get automobile details and append it to the result.

  Args:
    city: The city to search.
    link: The path portion of the URL to fetch.
    result: The automobile result set.
  """
  auto = _get_auto(city, link)
  if auto and auto.mileage and auto.price and auto.year:
    result.append(auto)
