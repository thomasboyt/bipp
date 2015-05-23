import shallowEqual from 'react-immutable-render-mixin/shallowEqualImmutable';

const pureRender = (Component) => {
  Object.assign(Component.prototype, {
    shouldComponentUpdate (nextProps, nextState) {
      return !shallowEqual(this.props, nextProps) ||
             !shallowEqual(this.state, nextState);
    }
  });
};

export default pureRender;
