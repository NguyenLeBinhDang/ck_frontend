import React, {useEffect} from 'react';
import './App.css';
import {RouterProvider} from "react-router-dom";
import {connectWS} from "./services/socket";
import {routes} from "./routes";


function App() {

    useEffect(() => {
        connectWS();
    });

    return (
        <RouterProvider router={routes}/>
    );
}

export default App;
