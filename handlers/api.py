"""api URL handlers"""

import craigslist
import pprint
import webapp2

class ListAutos(webapp2.RequestHandler):
    """ListAutos request handler."""
    def get(self):
      result = craigslist.list_autos('seattle', 'blazer')
      for i in result:
          print pprint.pformat(result)

class Ping(webapp2.RequestHandler):
    """Ping request handler"""
    def get(self):
        """GET method handler"""
        self.response.status = 204
