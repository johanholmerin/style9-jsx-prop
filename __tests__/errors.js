/* eslint-env jest */
const babel = require('@babel/core');
const plugin = require('../index');

function compile(input) {
  return babel.transformSync(input, {
    plugins: [plugin],
    highlightCode: false,
    parserOpts: {
      plugins: ['jsx']
    }
  });
}

it('throws on unsupported operator', () => {
  const input = `\
<div
  css={{
    ...(props.isRed ^ {})
  }}
/>;
  `;
  expect(() => compile(input)).toThrowErrorMatchingInlineSnapshot(`
    "unknown: Invalid operator BinaryExpression. Use '&&' or ternary instead
      1 | <div
      2 |   css={{
    > 3 |     ...(props.isRed ^ {})
        |         ^^^^^^^^^^^^^^^^
      4 |   }}
      5 | />;
      6 |   "
  `);
});
