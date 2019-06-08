# React `useStateEffects` hook

Allows excecution of side effects immediately after state is set by `setState` hook.

## Example

```jsx
import useStateEffects from 'react-state-effects';

const Example = ({ callback, children }) => {
  const [state, setState] = useStateEffects(1);

  React.useEffect(() => {
    setState(state$ => [state$ + 1, callback]);
  }, [])

  return children;
}
```

`setState` could accept zero, one or multiple callbacks:
```js
const cb1 = () => {...}
const cb2 = () => {...}

setState(state => [state + 1]);
setState(state => [state + 1, cb1]);
setState(state => [state + 1, cb1, cb2]);
```

In case current state is needed within callback, latest state could be injected by saving it within ref:

```jsx
import useStateEffects from 'react-state-effects';

const Example = ({ callback, children }) => {
  const [state, setState] = useStateEffects(1);
  const stateRef = React.useRef(state);

  React.useEffect(() => {
    setState(state$ => [state$ + 1, () => callback(stateRef.current)]);
  }, [])

  React.useEffect(() => {
    stateRef.current = state;
  }, [state])

  return children;
}
```