import * as React from "react";

type Effect = () => void;

interface State<S> {
  state: S;
  effects: Effect[];
}

type StateUpdate<S> = (state: S) => [S, ...Effect[]];

type Update<S> = (update: StateUpdate<S>) => void;

function useStateEffects<S>(initialState: S): [S, Update<S>] {
  const [{ state, effects }, setState] = React.useState<State<S>>({
    state: initialState,
    effects: []
  });

  const setState$: Update<S> = React.useCallback(
    update => setState(({ state, effects }) => {
      const [state$, ...effects$] = update(state);

      return {
        state: state$,
        effects: effects$ ? [...effects, ...effects$] : effects,
      };
    }),
    []
  );

  React.useEffect(() => {
    if (effects.length > 0) {
      setState(state => {
        effects.forEach(fx => fx());
        return ({ ...state, effects: [] })
      });
    }
  }, [effects]);

  return [
    state,
    setState$,
  ];
}

export default useStateEffects;
