import { combineReducers } from "redux";
import userReducer from "./reducers/userReducer";
import categoryReducer from "./reducers/categoryReducer";
import recordReducer from "./reducers/recordReducer";

const rootReducer = combineReducers({
    user: userReducer,
    categories: categoryReducer,
    records: recordReducer,
});

// RootState türünü çıkartıyoruz
export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;