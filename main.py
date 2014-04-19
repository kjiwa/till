import handlers
import webapp2

urls = (
  ('/', handlers.Index),
  ('/ping', handlers.Ping)
)

app = webapp2.WSGIApplication(urls)
