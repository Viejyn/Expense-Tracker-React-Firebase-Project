import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase";
import { LoginForm, User, UserDispatch } from "../../types/user"

export const login = ( creds: LoginForm ) => async (dispatch: UserDispatch) => {
    dispatch({ type: "LOGIN_START" });
    try {
        const userCredential = await signInWithEmailAndPassword(auth, creds.email, creds.password);
        const firebaseUser = userCredential.user;
        if (!firebaseUser) throw new Error("Giriş başarısız!");

        const userData: User = { 
            uid: firebaseUser.uid,
            email: firebaseUser.email || "",
            token: await firebaseUser.getIdToken()
        };

        dispatch({ type: "LOGIN_SUCCESS", payload: userData });
        localStorage.setItem("token", userData.token);
    } catch (error) {
        dispatch({ type: "LOGIN_ERROR", payload: "Giriş başarısız!" });
    }
};

export const isLoggedIn = () => async (dispatch: UserDispatch) => {
    dispatch({ type: "IS_LOGGED_IN_START" });
    try {
        onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                const userData: User = {
                    uid: firebaseUser.uid,
                    email: firebaseUser.email || "",
                    token: await firebaseUser.getIdToken()
                };
                dispatch({ type: "IS_LOGGED_IN_SUCCESS", payload: userData });
                localStorage.setItem("token", userData.token);
            } else {
                dispatch({ type: "IS_LOGGED_IN_ERROR", payload: "Oturum açık değil." });
                localStorage.removeItem("token");
            }
        });
    } catch {
        dispatch({ type: "IS_LOGGED_IN_ERROR", payload: "Hata oluştu." });
        localStorage.removeItem("token");
    }
};

export const logout = () => async (dispatch: UserDispatch) => {
    try {
        await signOut(auth);
        localStorage.removeItem("token");
        dispatch({ type: "LOGOUT" });
    } catch (error) {
        console.error("Çıkış yapılırken hata oluştu:", error);
    }   
};