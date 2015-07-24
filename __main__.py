"""An automobile price research tool."""

import bottle
import gflags
import logging
import server
import sys

FLAGS = gflags.FLAGS

gflags.DEFINE_integer('port', '8080', 'The port to listen on.')


def main(argv):
  logging.basicConfig(level=logging.DEBUG)

  try:
    argv = FLAGS(argv)
  except gflags.FlagsError, e:
    print '%s\\nUsage: %s ARGS\\n%s' % (e, sys.argv[0], FLAGS)
    sys.exit(1)

  bottle.run(app=server.APP, host='0.0.0.0', port=FLAGS.port)


if __name__ == '__main__':
  main(sys.argv)
