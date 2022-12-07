import _style2 from 'style9';
import _style from 'style9';
const _ref = props.color;

const _styles = _style.create({
  base: {
    color: 'var(--c2030976387)'
  }
});

<div
  className={`foo ${_styles('base')}`}
  style={{
    '--bar': 'none',
    '--c2030976387': _ref
  }}
/>;
const _ref2 = props.color;

const _styles2 = _style2.create({
  base: {
    color: 'var(--c2030976387)'
  }
});

<div
  className={_styles2('base')}
  style={{
    '--c2030976387': _ref2
  }}
/>;