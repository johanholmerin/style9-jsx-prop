const template = require('babel-template');
const t = require('@babel/types');
const NAME = require('./package.json').name;

const buildStyles = template(`
  const VAR_NAME = STYLE9.create({
    styles: STYLES
  });
`);

function buildStylesCall({ VAR_NAME }) {
  return t.callExpression(VAR_NAME, [t.stringLiteral('styles')]);
}

function buildImport({ STYLE9, importPath }) {
  return t.importDeclaration(
    [t.importDefaultSpecifier(STYLE9)],
    t.stringLiteral(importPath)
  );
}

function buildAttribute({ VAR_NAME }) {
  return t.jsxAttribute(
    t.jsxIdentifier('className'),
    t.jsxExpressionContainer(buildStylesCall({ VAR_NAME }))
  );
}

module.exports = function style9JSXPropPlugin() {
  return {
    name: NAME,
    visitor: {
      JSXAttribute(
        path,
        { opts: { propName = 'css', importPath = 'style9' } }
      ) {
        if (path.node.name.name !== propName) return;

        const VAR_NAME = path.scope.generateUidIdentifier('styles');
        const STYLES = path.get('value').isJSXExpressionContainer()
          ? path.node.value.expression
          : path.node.value;
        const program = path.findParent(parent => parent.isProgram());
        const STYLE9 = program.scope.generateUidIdentifier('style9');

        program.unshiftContainer('body', buildImport({ STYLE9, importPath }));
        program.scope.registerBinding('module', program.get('body.0'));

        if (path.scope.path.type !== 'Program') {
          path.scope.path.ensureBlock();
        }

        path
          .getStatementParent()
          .insertBefore(buildStyles({ STYLE9, VAR_NAME, STYLES }));
        path.parentPath.pushContainer(
          'attributes',
          buildAttribute({ VAR_NAME })
        );
        path.scope.crawl();
        path.remove();
      }
    }
  };
};
