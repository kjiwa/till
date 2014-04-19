import webapp2

class Index(webapp2.RequestHandler):
  def get(self):
    self.request.headers['Content-Type'] = 'text/plain'
    self.request.write('Hello')
