# style9-jsx-prop

**Experimental**

Style JSX elements with [style9](https://github.com/johanholmerin/style9) using
a prop.

```javascript
// From
<div css={{
  backgroundColor: 'red'
}} />

// To
import style9 from 'style9';

const styles = style9.create({
  styles: {
    backgroundColor: 'red'
  }
});
<div className={styles('styles')} />
```

## Install

```sh
yarn add git+https://github.com/johanholmerin/style9-jsx-prop#semver:^0.1.0
```
## Babel default options

```json
{
  "plugins": [
    ["style9-jsx-prop", {
      "propName": "css",
      "importPath": "style9"
    }]
  ]
}
```
