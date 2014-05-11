"""URL handlers"""

import os
import template
import webapp2

def static_resource(mime_type):
    """Create a request handler for the given mime type."""
    class RequestHandler(webapp2.RequestHandler):
        """Static resource request handler."""
        def get(self):
            """GET method handler"""
            with open('www/' + self.request.path_info) as handle:
                text = handle.read().decode()

            self.response.charset = 'utf8'
            self.response.content_type = mime_type
            self.response.text = text

    return RequestHandler

class Index(webapp2.RequestHandler):
    """Index request handler"""
    def get(self):
        """GET method handler"""
        self.response.charset = 'utf8'
        self.response.text = template.render(os.getcwd() + '/www/index.html')

class Ping(webapp2.RequestHandler):
    """Ping request handler"""
    def get(self):
        """GET method handler"""
        self.response.status = 204
