import {createBrowserRouter} from "react-router-dom";
import Login from "./pages/login/login";
import Register from "./pages/register/register";
import Chat from "./pages/chat/chat";
import ChatWindow from "./components/ChatWindow/ChatWindow";

export const routes = createBrowserRouter([
    {
        path: "/",
        element: <Login/>
    },
    {
        path: "/login",
        element: <Login/>
    },
    {
        path: "/register",
        element: <Register/>
    },
    {
        path: "/chat",
        element: <Chat/>,
        children: [
            {index: true, element: <ChatWindow/>}
        ]
    }

])