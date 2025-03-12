import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/actions/userActions";
import { RootState } from "../store";
import { useNavigate } from "react-router-dom";

function Logout() {

    const { data } = useSelector((state: RootState) => state.user);
    const dispatch = useDispatch<any>();
    const navigate = useNavigate();

    useEffect(() => {
        // çıkış işlemini başlat
        dispatch(logout());
        // Çıkış yaptıktan sonra login sayfasına yönlendir
        navigate("/login");
    }, [dispatch, navigate]); 

    return <div>Logging out...</div>;
}

export default Logout;