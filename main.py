import handlers
import webapp2

urls = (('/', handlers.index))
app = webapp2.WSGIApplication(urls)
