const babel = require('@babel/core');
const path = require('path');
const plugin = require('../index.js');

const output = babel.transformFileSync(path.resolve(__dirname, './input.js'), {
  plugins: [
    '@babel/plugin-syntax-jsx',
    [plugin, {
      propName: 'sx',
      // importPath: 'style9-theme/macro'
    }],
    'style9/babel'
  ],
});
console.log(output.code)
console.log(output.metadata.style9)
