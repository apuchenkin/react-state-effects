import * as React from 'react';
import TestRenderer from 'react-test-renderer';
import useStateEffects from './useStateEffects';

var count = 0;
const callback = jest.fn(() => {
  count = count + 2;
})

interface Props {
  callback: () => void;
}

const Example: React.FunctionComponent<Props> = ({ callback }) => {
  const [state, setState] = useStateEffects(1);

  React.useEffect(() => {
    setState(state => [state + 1, callback]);
    setState(state => [state + 1, callback]);
  }, [])

  return <div>{state}</div>;
}

test('adds 1 + 2 to equal 3', () => {
  TestRenderer.act(() => {
    TestRenderer.create(<Example callback={callback} />);
  });

  TestRenderer.act(() => {

  });

  expect(count).toBe(4);
  expect(callback).toBeCalledTimes(2);
});