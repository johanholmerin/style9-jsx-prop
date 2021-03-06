import _style from 'style9';

const _styles = _style.create({
  1: {
    color: 'red'
  },
  2: {
    color: 'blue'
  },
  base: {}
});

<div className={_styles('base', '1', props.isBlue && '2')} style={{}} />;
