import {login, logout} from "../redux/userSlice";
import {store} from "../redux/store";

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
            sendData(payload)
        }
    }

    socket.onmessage = (e) => {
        try {
            const data = JSON.parse(e.data);
            console.log('Received message from server: ' + data);
            if (data.event === "RE_LOGIN") {
                if (data.status === "success") {
                    localStorage.setItem('token', data.data.RE_LOGIN_TOKEN);
                    const currUser = localStorage.getItem('user') || '';
                    store.dispatch(login({user: currUser, token: data.data.RE_LOGIN_TOKEN}))
                } else {
                    logoutWS();
                }
            }

            // if(data.event === "REGISTER"){
            //
            // }

        } catch (e) {
            console.log('Received message from server', e);

        }
    }

    socket.onclose = () => {
        console.log('Connection closed!');
    }
}

const logoutWS = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    if (socket && socket.readyState === WebSocket.OPEN) {
        socket?.send(JSON.stringify({
            "action": "onchat",
            "data": {
                "event": "LOGOUT"
            }
        }));
    }

    store.dispatch(logout());
}

export const sendData = (data: any) => {
    socket?.send(JSON.stringify(data))
};

export const getSocket = () => socket;