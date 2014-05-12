"""www URL handlers"""

import os
import template
import webapp2

def redirect(url):
    """Create a request handler to redirect to the given URL."""
    class RequestHandler(webapp2.RequestHandler):
        """Redirect request handler."""
        def get(self):
            """GET method handler."""
            self.response.location = url
            self.response.status = 201

    return RequestHandler

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
