import React, {useEffect} from 'react';
import './App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {connectWS} from "./services/socket";
import Login from "./pages/login/login";
import Register from "./pages/register/register";
import Chat from "./pages/chat/chat";


function App() {

    useEffect(() => {
        connectWS();
    });

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login/>}></Route>
                <Route path="/login" element={<Login/>}></Route>
                <Route path="/register" element={<Register/>}></Route>
                <Route path="/chat" element={<Chat/>}></Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
