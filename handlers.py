import webapp2

class Index(webapp2.RequestHandler):
  def get(self):
    self.response.headers['Content-Type'] = 'text/plain'
    self.response.write('Hello')

class Ping(webapp2.RequestHandler):
  def get(self):
    pass
