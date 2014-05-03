"""URL handlers"""

import webapp2

class Index(webapp2.RequestHandler):
    """Index request handler"""
    def get(self):
        """GET method handler"""
        self.response.headers['Content-Type'] = 'text/plain'
        self.response.write('Hello')

class Ping(webapp2.RequestHandler):
    """Ping request handler"""
    def get(self):
        """GET method handler"""
        pass
