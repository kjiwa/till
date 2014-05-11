"""till"""

import handlers.api
import handlers.www
import paste.httpserver
import webapp2

_URLS = (
    (r'.*\.css', handlers.www.static_resource('text/css')),
    (r'.*\.js', handlers.www.static_resource('application/javascript')),
    ('/', handlers.www.Index),
    ('/index.html', handlers.www.redirect('/')),
    ('/_/list', handlers.api.List),
    ('/_/ping', handlers.api.Ping)
)

APP = webapp2.WSGIApplication(_URLS)

def main():
    """main"""
    paste.httpserver.serve(APP, host='localhost', port='8080')

if __name__ == '__main__':
    main()
