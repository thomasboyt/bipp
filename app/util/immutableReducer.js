export default function creatImmutableReducer(initialState, handlers) {
  return (state = initialState, action) => {
    if (handlers[action.type]) {
      const newState = handlers[action.type](action, state);
      return newState;
    } else {
      return state;
    }
  };
}
