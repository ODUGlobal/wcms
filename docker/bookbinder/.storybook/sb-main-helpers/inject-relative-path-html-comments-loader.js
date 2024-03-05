const path = require('path');

// eslint-disable-next-line func-names
module.exports = function (source) {
  const relativePath = '/' + path.relative(this.rootContext, this.resourcePath);
  const startComment = `<!-- START: ${relativePath} -->`;
  const endComment = `<!-- END: ${relativePath} -->`;
  // TODO: try automatically giving every template an `attributes`, `title_attributes`, and `content_attributes`
  // const createAttributes = `{% set attributes = create_attribute() %}`;
  /*
    Problem: Twing doesn't let any content (including HTML comments) appear outside of `block`s in
    a template that `extends` another.

    Janky solution: if a Twig file starts with `{% extends `, then wrap each of the two
    HTML comments in a block (`_startExtends` for the first, and `_endExtends` for the
    last), and make sure that the extended template has an empty `_startExtends` block
    at the start and an empty `_endExtends` block at the end (so that each will be
    overridden by the corresponding block in the extending template). Relies on remembering
    to do this in templates that will be extended, and also relies on making sure that
    `{% extends ` always comes first in an extending template (or, first on a new line, anyway)!
  */
  if (/(?:^|\n){% extends /g.test(source.trimStart())) {
    return `{% block _startExtends %}${startComment}{% endblock %}\n${source}\n{% block _endExtends %}${endComment}{% endblock %}`;
  }
  return `${startComment}\n${source}\n${endComment}`;
};
