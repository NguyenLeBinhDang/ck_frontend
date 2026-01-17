import React, {useEffect} from 'react';
import {Outlet, useNavigate, useLocation} from "react-router-dom";
import {connectWS} from "../../services/socket";
import {useAppSelector} from "../../redux/hooks";

export const RootLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const publicPaths = ["/login", "/register"];

    const {re_login_code} = useAppSelector(state => state.user);

    useEffect(() => {
        connectWS();
    }, []);

    useEffect(() => {
        if (!re_login_code) {
            if (!publicPaths.includes(location.pathname)) {
                navigate("/login");
            }
        } else if (publicPaths.includes(location.pathname) || location.pathname === "/") {
            navigate("/chat");
        }
    }, [re_login_code, navigate, location.pathname]);

    return (
        <div className="app-container">
            <Outlet/>
        </div>
    );
};