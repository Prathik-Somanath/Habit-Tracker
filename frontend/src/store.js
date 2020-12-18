// file to setup a global app state
import React, { createContext, useReducer } from 'react';

const store = createContext(null);
const { Provider } = store;

//provider component for global context
const StateProvider = ({ children }) => {
  //reducer that is stored in the global context
  const [state, dispatch] = useReducer(
    //Reducer function that mimics setState function and updates proerties upto single level depth
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
  //initializing context with a reducer state and dispatch functions 
  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { store, StateProvider };
