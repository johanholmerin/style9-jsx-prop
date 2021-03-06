import _style from 'style9';

const _styles = _style.create({
  1: {
    '@media (max-width: 800px)': {
      color: 'purple'
    }
  },
  base: {
    '@media (max-width: 800px)': {}
  }
});

<div className={_styles('base', props.isPurple && '1')} style={{}} />;
