"""URL handlers"""

import os
import template
import webapp2

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
