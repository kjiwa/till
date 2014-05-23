"""www URL handlers"""

import os
import template
import webapp2

def redirect(url):
    """Create a request handler to redirect to the given URL.

    Args:
        url: The URL to redirect to.

    Returns:
        A class definition of a request handler that will always redirect the
        user to the given URL.
    """
    class RequestHandler(webapp2.RequestHandler):
        """Redirect request handler."""
        def get(self):
            """GET method handler."""
            self.response.location = url
            self.response.status = 301

    return RequestHandler

def static_resource(mime_type):
    """Create a request handler for the given mime type.

    Args:
        mime_type: The mime-type of the static resource being served.

    Returns:
        A class definition of a request handler that returns a static resource.
    """
    class RequestHandler(webapp2.RequestHandler):
        """Static resource request handler."""
        def get(self):
            """GET method handler"""
            self.response.charset = 'utf8'
            self.response.content_type = mime_type

            with open('www/' + self.request.path_info) as handle:
                self.response.text = handle.read().decode()

    return RequestHandler

class Index(webapp2.RequestHandler):
    """Index request handler"""
    def get(self):
        """GET method handler"""
        self.response.charset = 'utf8'
        self.response.text = template.render(os.getcwd() + '/www/index.html')
