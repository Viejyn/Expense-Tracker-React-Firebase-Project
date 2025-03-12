import { User, UserAction, UserState } from "../../types/user";

const defaultState: UserState = {
    data: {
        uid: "",
        email: "",
        token: ""
    } ,
    loading: false,
    error: ""
};

const userReducer = (state = defaultState, action: UserAction): UserState => {
    switch (action.type) {
        case "LOGIN_START":
        case "IS_LOGGED_IN_START":
            return {
                ...state,
                loading: true,
                error: ""
            };
        case "LOGIN_SUCCESS":
        case "IS_LOGGED_IN_SUCCESS":
            return {
                ...state,
                loading: false,
                data: action.payload, // payload burada güncelleniyor
                error: ""
            };
        case "LOGIN_ERROR":
            return {
                ...state,
                loading: false,
                error: "Login failed." // Hata mesajını burada güncelleyebilirsiniz
            };
        case "IS_LOGGED_IN_ERROR":
            return {
                ...state,
                loading: false,
                error: "Token missing or invalid."
            };
        case "LOGOUT":
            return {
                ...state,
                data: {} as User
            };
        default:
            return state;
    }
};

export default userReducer;