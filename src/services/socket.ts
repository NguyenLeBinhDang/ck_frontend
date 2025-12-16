import {loginSuccess, logout} from "../redux/userSlice";
import {store} from "../redux/store";
import {useAppDispatch} from "../redux/hooks";

let socket: WebSocket | null = null;

export const connectWS = () => {
    const url = process.env.REACT_APP_WS_URL || 'http://localhost:3000';

    if (socket && socket.readyState === WebSocket.OPEN) {
        console.log('Server connected!');
        return;
    }

    socket = new WebSocket(url);

    socket.onopen = () => {
        console.log('Connected to server');

        const storedUsername = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');

        if (storedUsername && storedToken) {

            const payload = {
                action: "onchat",
                data: {
                    event: "RE_LOGIN",
                    data: {
                        user: storedUsername,
                        token: storedToken,
                    }
                }
            }
            // socket?.send(JSON.stringify(payload));
            sendData(payload)
        }

    }

    socket.onmessage = (e) => {
        try {
            const data = JSON.parse(e.data);
            console.log('Received message from server');
            if (data.event === "RE_LOGIN") {
                if (data.data && data.data.RE_LOGIN_TOKEN) {
                    localStorage.setItem('token', data.data.RE_LOGIN_TOKEN);
                    const currUser = localStorage.getItem('user') || '';

                    store.dispatch(loginSuccess({user: currUser, token: data.data.RE_LOGIN_TOKEN}))
                } else {
                    throw new Error("Invalid login token");
                }
            }
        } catch (e) {
            console.log('Received message from server', e);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            store.dispatch(logout());
        }
    }

    socket.onclose = () => {
        console.log('Connection closed!');
    }


}

export const sendData = (data: any) => {
    socket?.send(JSON.stringify(data))
};

export const getSocket = () => socket;