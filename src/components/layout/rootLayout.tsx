import React, {useEffect} from 'react';
import {Outlet, useNavigate, useLocation} from "react-router-dom";
import {connectWS} from "../../services/socket";
import {useAppDispatch, useAppSelector} from "../../redux/hooks";

export const RootLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    // const dispatch = useAppDispatch();

    const {re_login_code} = useAppSelector(state => state.user);

    useEffect(() => {
        connectWS();
    }, []);

    useEffect(() => {
        if (!re_login_code) {
            if (location.pathname !== "/login") {
                navigate("/login");
            }
        } else {
            if (location.pathname === "/login" || location.pathname === "/") {
                navigate("/chat");
            }
        }
    }, [re_login_code, navigate, location.pathname]);

    return (
        <div className="app-container">
            <Outlet/>
        </div>
    );
};