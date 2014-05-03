"""till"""

import handlers
import paste.httpserver
import webapp2

_URLS = (
    ('/', handlers.Index),
    ('/ping', handlers.Ping)
)

APP = webapp2.WSGIApplication(_URLS)

def main():
    """main"""
    paste.httpserver.serve(APP, host='localhost', port='8080')

if __name__ == '__main__':
    main()
