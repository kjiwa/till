"""Cache methods."""

import memcache

_CLIENT = memcache.Client([('127.0.0.1', 11211)])

def get(key):
    """Fetch a  value from the cache."""
    return _CLIENT.get(key.encode('utf8'))

def add(key, value):
    """Store a value in the cache."""
    return _CLIENT.set(key.encode('utf8'), value)
