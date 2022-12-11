import _style from 'style9';
const _ref = props.color;

const _styles = _style.create({
  base: {
    color: 'var(--c2030976387)'
  }
});

<div
  className={`${foo || ''} ${_styles('base')}`}
  style={{ ...bar, '--c2030976387': _ref }}
/>;
