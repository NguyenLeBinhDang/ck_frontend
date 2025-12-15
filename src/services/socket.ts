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
    }

    socket.onmessage = (e) => {
        const data = JSON.parse(e.data);
        console.log('Received message from server');

        if (data.event === 'RE_LOGIN') {
            console.log('logging successfully');
        }
    }

    socket.onclose = () => {
        console.log('Connection closed!');
    }


}

export const sendData = (data: any) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(data));
    } else {
        console.log('Connection failed!');
    }
}

export const getSocket = () => socket;