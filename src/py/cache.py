"""Cache methods."""

try:
  import google.appengine.api
  _CLIENT = google.appengine.api.memcache
except ImportError:
  import memcache
  _CLIENT = memcache.Client([('127.0.0.1', 11211)])

def get(key):
  """Fetch a  value from the cache.

  Args:
    key: The cache key.

  Returns:
    The stored value or None.
  """
  return _CLIENT.get(key.encode('utf8'))

def add(key, value):
  """Store a value in the cache.

  Args:
    key: The cache key.
    value: The value to store.
  """
  return _CLIENT.set(key.encode('utf8'), value)
