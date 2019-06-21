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
      const [state$, ...pendingEffects] = update(state);
      const effects$ = pendingEffects.filter(
        effect => effect && typeof effect === 'function'
      )

      return {
        state: state$,
        effects: effects$ ? [...effects, ...effects$] : effects,
      };
    }),
    []
  );

  React.useEffect(() => {
    if (effects.length > 0) {

      // Delay needed in order to ensure that executed after refs being set
      setTimeout(() => {
        effects.forEach(fx => fx());
      })

      setState(state => ({ ...state, effects: [] }));
    }
  }, [effects]);

  return [
    state,
    setState$,
  ];
}

export default useStateEffects;
