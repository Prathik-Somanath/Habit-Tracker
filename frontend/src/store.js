// file to setup a global app state
import React, { createContext, useReducer } from 'react';

const store = createContext(null);
const { Provider } = store;

const StateProvider = ({ children }) => {
  const [state, dispatch] = useReducer(
    (prevState, action) => {
      if (action) {
        const newState = { ...prevState };
        const keys = Object.keys(action);
        for (let i = 0; i < keys.length; i++)
          newState[`${keys[i]}`] = action[`${keys[i]}`];
        return newState;
      } else {
        return {};
      }
    },
    {
      prevDownload: null,
    },
  );

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { store, StateProvider };
