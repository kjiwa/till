import handlers
import webapp2

urls = (('/', handlers.Index))
app = webapp2.WSGIApplication(urls)
