"""api URL handlers"""

import webapp2

class List(webapp2.RequestHandler):
  """List request handler."""
  def get(self):
    pass

class Ping(webapp2.RequestHandler):
    """Ping request handler"""
    def get(self):
        """GET method handler"""
        self.response.status = 204
