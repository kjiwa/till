"""craigslist client."""

import collections
import logging
import re
import threading
import urllib
import lxml.etree

Automobile = collections.namedtuple('Automobile', ['mileage', 'price', 'year'])


def list_autos(city, query):
  """Query automobiles.

  Args:
    city: The city to search.
    query: An optional phrase to search for.

  Returns:
    A list of matching Automobiles.
  """
  result = []
  for i in range(0, 10):
    autos = _list_autos(city, query.lower(), i)
    result_len = len(result)

    threads = []
    for j in autos:
      thread = threading.Thread(
          target=_get_auto_thread, args = (city, j, result))
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


def _get_auto(city, link):
  """Fetch and extract automobile details.

  Args:
    city: The city to search.
    link: The path portion of the URL to fetch.

  Returns:
    An Automobile object.
  """
  url = link
  if not link.startswith('http://'):
    url = 'http://%s.craigslist.org%s' % (
        urllib.quote(city), urllib.quote(link))

  tree = lxml.etree.HTML(_read_url(url))
  elements = tree.xpath('//p[@class="attrgroup"]/span')
  attrs = [lxml.etree.tostring(
      i, encoding='unicode', method='text') for i in elements]

  return Automobile(
      _get_auto_mileage(attrs), _get_auto_price(tree), _get_auto_year(attrs))


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
  pattern = re.compile(r'^.*\$(\d+).*$')
  elements = tree.xpath('//h2[@class="postingtitle"]')
  for i in elements:
    title = lxml.etree.tostring(i, encoding='unicode', method='text')
    match = pattern.match(title.strip())
    return int(match.group(1)) if match else None


def _get_auto_year(attrs):
  """Extract year from automobile attributes.

  Args:
    attrs: A list of strings containing craigslist attributes.

  Returns:
    A year value or None.
  """
  pattern = re.compile(r'^\s*(\d+).*$')
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
  qstr = urllib.urlencode({
      'hasPic': 1,
      'query': query,
      's': page * 100,
      'srchType': 'T'
  })

  url = 'http://%s.craigslist.org/search/cta?%s' % (urllib.quote(city), qstr)
  tree = lxml.etree.HTML(_read_url(url))
  if tree is not None:
    elements = tree.xpath('//p[@data-pid]/a')
    return [i.attrib.get('href') for i in elements]

  return []


def _read_url(url):
  """Read content from a URL.

  Args:
    url: The URL to fetch.

  Returns:
    A string representing the contents of the URL.
  """
  return urllib.urlopen(url).read()


def _get_auto_thread(city, link, result):
  """Get automobile details and append it to the result.

  Args:
    city: The city to search.
    link: The path portion of the URL to fetch.
    result: The automobile result set.
  """
  auto = _get_auto(city, link)
  if auto.mileage and auto.price and auto.year:
    result.append(auto)
