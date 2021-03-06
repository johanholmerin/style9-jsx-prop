import _style from 'style9';

const _styles = _style.create({
  1: {
    color: 'blue'
  },
  base: {}
});

<div className={_styles('base', props.isBlue && '1')} style={{}} />;
