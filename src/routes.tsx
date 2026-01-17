import {createBrowserRouter} from "react-router-dom";
import Login from "./pages/login/login";
import Register from "./pages/register/register";
import ChatWindow from "./components/ChatWindow/ChatWindow";
import ChatLayout from "./pages/chat/chatLayout";
import ChatWelcome from "./components/ChatWindow/ChatWelcome";
import {RootLayout} from "./components/layout/rootLayout";

export const routes = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout/>,
        children: [
            {
                path: "login",
                element: <Login/>
            },
            {
                path: "register",
                element: <Register/>
            },
            {
                path: "chat",
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
        ]
    },


])