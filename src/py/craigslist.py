"""craigslist client."""

import cache
import collections
import logging
import lxml.etree
import re
import urllib

Automobile = collections.namedtuple('Automobile', ['mileage', 'price', 'year']);

def list_autos(city, query):
    """Query automobiles."""
    key = 'till.craigslist.list_autos-%d-%d' % (hash(city), hash(query))
    result = cache.get(key)
    if result:
        return result

    logging.info('No result found in cache.')

    result = []
    for i in range(0, 10):
        autos = _list_autos(city, query, i)
        for j in autos:
            auto = _get_auto(city, j)
            if auto.mileage and auto.price and auto.year:
                result.append(auto)
        logging.info('Found %d automobiles after %d pages.', len(result), i + 1)

    logging.info('Found %d automobiles total.', len(result))
    cache.add(key, result)
    return result

def _get_auto(city, link):
    """Fetch automobile details."""
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
    """Extract mileage from automobile attributes."""
    pattern = re.compile(r'odometer:\s*(\d+)\s*')
    for i in attrs:
        match = pattern.match(i)
        if match:
            mileage = int(match.group(1))
            mileage *= 1000 if mileage < 1000 else 1
            return mileage

def _get_auto_price(tree):
    """Extract price from automobile details."""
    pattern = re.compile(r'^.*\$(\d+).*$')
    elements = tree.xpath('//h2[@class="postingtitle"]')
    for i in elements:
        title = lxml.etree.tostring(i, encoding='unicode', method='text')
        match = pattern.match(title.strip())
        return int(match.group(1)) if match else None

def _get_auto_year(attrs):
    """Extract year from automobile attributes."""
    pattern = re.compile(r'^\s*(\d+).*$')
    for i in attrs:
        match = pattern.match(i)
        if match:
            return int(match.group(1))

def _list_autos(city, query, page):
    """Query automobiles starting on page i."""
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
    """Read content from a URL."""
    return urllib.urlopen(url).read()
