"""api URL handlers"""

import StringIO
import craigslist
import csv
import webapp2

class ListAutos(webapp2.RequestHandler):
    """ListAutos request handler."""
    def get(self):
        """GET method handler."""
        city = self.request.GET['city']
        query = self.request.GET['query']
        result = craigslist.list_autos(city, query)

        out = StringIO.StringIO()
        writer = csv.writer(out)
        writer.writerow(['Mileage', 'Price', 'Year'])
        for i in result:
            writer.writerow([i['mileage'], i['price'], i['year']])

        self.response.charset = 'utf8'
        self.response.content_type = 'text/csv'
        self.response.text = out.getvalue().strip().decode()

        out.close()

class Ping(webapp2.RequestHandler):
    """Ping request handler"""
    def get(self):
        """GET method handler"""
        self.response.status = 204
