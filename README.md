# style9-jsx-prop

**Experimental**

Style JSX elements with [style9](https://github.com/johanholmerin/style9) using
a prop. Supports dynamic values using CSS custom properties.

```javascript
// From
<div css={{
  color: 'blue',
  opacity: props.hidden && 0,
  ...(props.isRed && {
    color: 'red'
  }),
  ':hover': {
    color: props.hoverColor
  },
  animationName: {
    from: { opacity: 0 }
  }
}} />

// To
import style9 from 'style9';

const styles = style9.create({
  base: {
    color: 'blue',
    ':hover': {
      color: 'var(--hover-color)'
    },
    animationName: style9.keyframes({
      from: { opacity: 0 }
    })
  },
  hidden: {
    opacity: 0,
  },
  red: {
    color: 'red',
  }
});

<div
  className={styles('base', props.hidden && 'hidden', props.isRed && 'red')}
  style={{ '--hover-color': props.hoverColor }}
/>;
```

## Install

```sh
# Yarn
yarn add -D style9-jsx-prop

# npm
npm install -D style9-jsx-prop
```

## Babel default options

```json
{
  "plugins": [
    ["module:style9-jsx-prop", {
      "propName": "css",
      "importPath": "style9"
    }]
  ]
}
```
