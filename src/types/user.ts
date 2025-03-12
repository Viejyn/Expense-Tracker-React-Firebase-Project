import { ThunkDispatch } from "redux-thunk";

export interface User {
    uid: string;
    email: string;
    token: string;
}

export interface LoginForm {
    email: string;
    password: string;
}

export interface UserState {
    data: User | null;
    loading: boolean;
    error: string | null;
}

interface LOGIN_START {
    type: "LOGIN_START";
}

interface LOGIN_SUCCESS {
    type: "LOGIN_SUCCESS";
    payload: User;
}

interface LOGIN_ERROR {
    type: "LOGIN_ERROR";
    payload: string;
}

interface IS_LOGGED_IN_START {
    type: "IS_LOGGED_IN_START";
}

interface IS_LOGGED_IN_SUCCESS {
    type: "IS_LOGGED_IN_SUCCESS";
    payload: User;
}

interface IS_LOGGED_IN_ERROR {
    type: "IS_LOGGED_IN_ERROR";
    payload: string;
}

interface LOGOUT {
    type: "LOGOUT";
}

export type UserAction = 
  LOGIN_START | 
  LOGIN_SUCCESS | 
  LOGIN_ERROR |
  IS_LOGGED_IN_START |
  IS_LOGGED_IN_SUCCESS |
  IS_LOGGED_IN_ERROR |
  LOGOUT;
export type UserDispatch = ThunkDispatch<UserState, void, UserAction>;