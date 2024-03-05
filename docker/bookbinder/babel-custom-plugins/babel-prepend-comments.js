/*
  Note: the `NodePath` type is supposed to have an `addComment()`/`addComments()`
  API, but it doesn't seem to be working, so I'm re-assigning the `leadingComments`
  arrays directly as needed (but also, there doesn't appear to be a `removeComment()`
  method, so I think I'd have to re-assign them anyway).
*/

/** @typedef {import('@babel/core').NodePath} NodePath */
/** @typedef {import('@babel/core').Node} Node */

/**
 * For keeping track of nodes we've already visited (because we only
 * want to inject the comment once, but Babel may run this on each
 * file multiple times).
 *
 * @type {Map<NodePath, Set<Node>>}
 */
const visitedNodesByPath = new Map();

module.exports = () => ({
  visitor: {
    Program(
      /** @type NodePath */
      path,
      state
    ) {
      const value = `\n  @preserve\n  ${state.opts.lines.join('\n  ')}\n`;

      /** @type Node */
      const { node } = path.get('body.0');

      if (visitedNodesByPath.has(path)) {
        const visitedNodes = visitedNodesByPath.get(path);
        for (const visitedNode of visitedNodes) {
          visitedNode.leadingComments = visitedNode.leadingComments?.filter(
            (e) => e.value !== value
          );
        }
      } else {
        visitedNodesByPath.set(path, new Set());
      }

      visitedNodesByPath.get(path).add(node);

      node.leadingComments = (node.leadingComments || []).concat({
        value,
        type: 'CommentBlock',
      });
    },
  },
});
