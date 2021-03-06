import _style from 'style9';

() => {
  const _styles = _style.create({
    base: {
      color: 'red'
    }
  });

  return <div className={_styles('base')} style={{}} />;
};
