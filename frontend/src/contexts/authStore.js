import React, { useReducer } from "react";
import { SET_TOKEN, SET_USER } from "../constant";
import Cookies from "js-cookie";

const authReducer = (state, action) => {
  switch (action.type) {
    case SET_TOKEN:
      Cookies.set("token", action.payload.token);
      return {
        ...state,
        token: action.payload.token,
      };
    case SET_USER:
      return {
        ...state,
        user: action.payload.user,
      };
    case "TOGGLE_REFETCH":
      return {
        ...state,
        refetch: !state.refetch,
      };
    default:
      return state;
  }
};

const initialState = {
  token: "",
  user: {},
  refetch: false,
};
const AuthContext = React.createContext({
  authContext: initialState,
  setToken: () => {},
  setUser: () => {},
});

export const AuthProvider = (props) => {
  const [authContext, dispatch] = useReducer(authReducer, initialState);

  const setToken = (token) => {
    dispatch({
      type: SET_TOKEN,
      payload: { token },
    });
  };
  const setUser = (user) => {
    dispatch({
      type: SET_USER,
      payload: { user },
    });
  };
  const toggleRefetch = () => {
    dispatch({
      type: "TOGGLE_REFETCH",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        authContext: authContext,
        setToken,
        setUser,
        toggleRefetch,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => React.useContext(AuthContext);
