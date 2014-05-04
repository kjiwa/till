"""URL handlers"""

import jinja2
import os
import webapp2

class Index(webapp2.RequestHandler):
    """Index request handler"""
    def get(self):
        """GET method handler"""
        with open(os.getcwd() + '/www/index.html') as f:
            template = jinja2.Template(f.read())

        self.response.charset = 'utf8'
        self.response.text = template.render()

class Ping(webapp2.RequestHandler):
    """Ping request handler"""
    def get(self):
        """GET method handler"""
        self.response.status = 204
