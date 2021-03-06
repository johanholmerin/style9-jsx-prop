import _style from 'style9';

const _styles = _style.create({
  base: {
    animationName: _style.keyframes({
      from: {
        opacity: 1
      },
      to: {
        opacity: 0
      }
    })
  }
});

<div className={_styles('base')} style={{}} />;
