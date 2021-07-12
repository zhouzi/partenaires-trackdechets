import * as React from "react";
import * as localStorage from "local-storage";

export function usePersistedState<State>(
  key: string,
  initialState: State,
  serializeState: (state: State) => Record<string, any>,
  deserializeState: (serializedState: Record<string, any>) => State
) {
  const [state, setState] = React.useState<State>(initialState);

  React.useEffect(() => {
    const serializedState = localStorage.get<Record<string, any> | undefined>(
      key
    );

    if (serializedState == null) {
      return;
    }

    setState(deserializeState(serializedState));
  }, [key, setState, deserializeState]);

  React.useEffect(() => {
    localStorage.set(key, serializeState(state));
  }, [key, state, serializeState]);

  return [state, setState] as const;
}
