const template = require('babel-template');
const hash = require('murmurhash-js');
const t = require('@babel/types');
const NAME = require('./package.json').name;

const buildStyles = template(`
  const VAR_NAME = STYLE9.create(STYLES);
`);

const buildKeyframes = template(`
  STYLE9.keyframes(KEYFRAMES);
`);

function buildImport({ STYLE9, importPath }) {
  return t.importDeclaration(
    [t.importDefaultSpecifier(STYLE9)],
    t.stringLiteral(importPath)
  );
}

function buildStyleObject(objExpr, root) {
  const parents = [];
  let parent = objExpr;
  while (parent !== root) {
    if (parent.isObjectProperty()) {
      parents.push(parent.node.key.name || parent.node.key.value);
    }
    parent = parent.parentPath;
  }

  let node = objExpr.node;
  parents.forEach(key => {
    node = t.objectExpression([t.objectProperty(t.stringLiteral(key), node)]);
  });

  return node;
}

function parseSpread(arg, keys, styles, root) {
  if (arg.isLogicalExpression({ operator: '&&' })) {
    const key = String(Object.keys(styles).length);
    keys.push(t.logicalExpression('&&', arg.node.left, t.stringLiteral(key)));
    styles[key] = buildStyleObject(arg.get('right'), root);
  } else if (arg.isConditionalExpression()) {
    const key1 = String(Object.keys(styles).length);
    const key2 = String(Object.keys(styles).length + 1);
    keys.push(
      t.stringLiteral(key1),
      t.logicalExpression('&&', arg.node.test, t.stringLiteral(key2))
    );
    styles[key1] = buildStyleObject(arg.get('alternate'), root);
    styles[key2] = buildStyleObject(arg.get('consequent'), root);
  } else {
    throw arg.buildCodeFrameError(
      `Invalid operator ${arg.node.type}. Use '&&' or ternary instead`
    );
  }
}

function splitSpreads(objExpr) {
  const keys = [t.stringLiteral('base')];
  const splitObject = {
    base: objExpr.node
  };

  objExpr.traverse({
    SpreadElement(path) {
      parseSpread(path.get('argument'), keys, splitObject, objExpr);
      path.remove();
    }
  });

  const props = t.objectExpression(
    Object.entries(splitObject).map(([key, value]) =>
      t.objectProperty(t.identifier(key), value)
    )
  );

  return { props, keys };
}

function buildClassAttribute({ VAR_NAME, keys }) {
  return t.jsxAttribute(
    t.jsxIdentifier('className'),
    t.jsxExpressionContainer(t.callExpression(VAR_NAME, keys))
  );
}

function splitDynamicProperties(objExpr) {
  const stat = objExpr;
  const properties = [];

  objExpr.traverse({
    ObjectProperty(path) {
      const value = path.get('value');
      if (value.isObjectExpression()) return;
      const { confident, deopt } = value.evaluate();
      if (confident) return;
      const cssVarName = `--c${hash(deopt.toString())}`;
      const idName = path.scope.generateUidBasedOnNode(value);

      path
        .getStatementParent()
        .insertBefore(
          t.variableDeclaration('const', [
            t.variableDeclarator(t.identifier(idName), value.node)
          ])
        );
      value.replaceWith(t.stringLiteral(`var(${cssVarName})`));

      properties.push(
        t.objectProperty(t.stringLiteral(cssVarName), t.identifier(idName))
      );
    }
  });

  const dynamic = t.objectExpression(properties);

  return { stat, dynamic };
}

const KEYFRAME_PROPERTIES = ['animationName', 'animation', 'animation-name'];

function replaceKeyframes(objExpr, STYLE9) {
  objExpr.traverse({
    ObjectProperty(path) {
      // istanbul ignore if
      if (path.node.computed) return;

      const key = path.get('key');
      if (!key.isIdentifier()) return;
      const { name } = key.node;
      if (!KEYFRAME_PROPERTIES.includes(name)) return;
      const value = path.get('value');
      if (!value.isObjectExpression()) return;

      value.replaceWith(buildKeyframes({ STYLE9, KEYFRAMES: value.node }));
    }
  });
}

function buildStyleAttribute(objExpr) {
  return t.jsxAttribute(
    t.jsxIdentifier('style'),
    t.jsxExpressionContainer(objExpr)
  );
}

module.exports = function style9JSXPropPlugin() {
  return {
    name: NAME,
    visitor: {
      Program(progPath, { opts: { propName = 'css', importPath = 'style9' } }) {
        progPath.traverse({
          JSXAttribute(path) {
            if (path.node.name.name !== propName) return;

            const VAR_NAME = path.scope.generateUidIdentifier('styles');
            if (!path.get('value').isJSXExpressionContainer()) return;
            const styles = path.get('value.expression');
            if (!styles.isObjectExpression()) return;
            const program = path.findParent(parent => parent.isProgram());
            const STYLE9 = program.scope.generateUidIdentifier('style9');

            program.unshiftContainer(
              'body',
              buildImport({ STYLE9, importPath })
            );
            program.scope.registerBinding('module', program.get('body.0'));

            if (
              path.scope.path.type !== 'Program' &&
              !Array.isArray(path.scope.path.get('body'))
            ) {
              path.scope.path.ensureBlock();
            }

            const { stat, dynamic } = splitDynamicProperties(styles);
            replaceKeyframes(stat, STYLE9);
            const { keys, props: STYLES } = splitSpreads(stat);

            path
              .getStatementParent()
              .insertBefore(buildStyles({ STYLE9, VAR_NAME, STYLES }));
            path.parentPath.pushContainer(
              'attributes',
              buildClassAttribute({ VAR_NAME, keys })
            );
            path.parentPath.pushContainer(
              'attributes',
              buildStyleAttribute(dynamic)
            );
            path.scope.crawl();
            path.remove();
          }
        });
      }
    }
  };
};
