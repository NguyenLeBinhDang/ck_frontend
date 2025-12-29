import {createBrowserRouter} from "react-router-dom";
import Login from "./pages/login/login";
import Register from "./pages/register/register";
import ChatWindow from "./components/ChatWindow/ChatWindow";
import ChatLayout from "./pages/chat/chatLayout";
import ChatWelcome from "./components/ChatWindow/ChatWelcome";

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
        element: <ChatLayout/>,
        children: [
            {
                index: true,
                element: <ChatWelcome/>

            },
            {
                path: ":id",
                element: <ChatWindow/>
            }
        ]
    }

])