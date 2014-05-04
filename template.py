"""HTML template methods."""

import jinja2

def render(filename):
  """Render an HTML template as a string.

  Args:
    filename: The HTML template file name.

  Returns:
    A string of the rendered HTML.
  """
  with open(filename) as f:
    template = jinja2.Template(f.read())
    return template.render()
