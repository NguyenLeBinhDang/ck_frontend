import {loginFail, loginSuccess, logout} from "../redux/userSlice";
import {store} from "../redux/store";
import {
    receiveMessage,
    setConversations,
    setMessages,
    updateUserStatus
} from "../redux/chatSlice";

let socket: WebSocket | null = null;

export const connectWS = () => {
    const url = process.env.REACT_APP_WS_URL;
    if (!url) {
        console.error("WS URL is missing");
        return;
    }
    if (socket && (socket?.readyState === WebSocket.OPEN || socket?.readyState === WebSocket.CONNECTING)) {
        console.log('Socket is connecting or already connected.');
        return;
    }

    socket = new WebSocket(url);

    socket.onopen = () => {
        console.log('Connected to server');

        const storedUsername = localStorage.getItem('user');
        const storedReLoginCode = localStorage.getItem('re_login_code');

        if (storedUsername && storedReLoginCode) {

            const payload = {
                action: "onchat",
                data: {
                    event: "RE_LOGIN",
                    data: {
                        user: storedUsername,
                        // token: storedReLoginCode,// chỗ này api lưu là code ms đúng nè
                        code: storedReLoginCode
                    }
                }
            }
            sendData(payload);
        }
    }

    socket.onmessage = (e) => {
        try {
            const res = JSON.parse(e.data);
            const{event, data, status} = res;
            switch (event) {
                case "RE_LOGIN":
                case "LOGIN":
                    if (status === "success") {
                        const code = data.RE_LOGIN_CODE;
                        const state = store.getState();
                        const currUser = state.user.temp_user;

                        if (currUser) {
                            localStorage.setItem('user', currUser);
                        }
                        if (code) localStorage.setItem('re_login_code', code);
                        store.dispatch(loginSuccess({re_login_code: code}));

                        getUserList();
                    } else {
                        store.dispatch(loginFail());
                        logoutWS();
                    }
                    break;
                case "GET_USER_LIST":
                    if(status === "success") {
                        store.dispatch(setConversations(data));
                        if(Array.isArray(data)){
                            data.forEach(u => {
                                if (u.type === 0 && u.name) {
                                    checkUserOnline(u.name);
                                    getPeopleChatMes(u.name)
                                }
                                else{
                                    getRoomChatMes(u.name);
                                }
                            })
                        }
                    }
                    break;
                case "CHECK_USER_ONLINE":
                    if (status === "success" ) {
                        // kiểm tra tạm bằng console trước khi thay bằng redux
                        console.log(`User ${data.user} is online: ${data.status}`);
                        // Có thể dispatch action update status user ở đây
                        store.dispatch(updateUserStatus({
                            id: data.user, //api đặt là user
                            isOnline: data.status,
                        }));
                    }
                    break;

                case "GET_PEOPLE_CHAT_MES":
                case "GET_ROOM_CHAT_MES":
                    if(status === "success") {
                        store.dispatch(setMessages({ messages: data, isHistory: true }));
                    }
                    break;

                case "SEND_CHAT":
                    // Nhận tin nhắn realtime từ server
                    store.dispatch(receiveMessage(data));
                    break;
                case "ERROR":
                    console.error("Server Error:", res.mes);
                    break;
                default: break;
            }

        } catch (e) {
            console.log('Received message from server', e);

        }
    }

    socket.onclose = () => {
        console.log('Connection closed!');
    }
}

const logoutWS = () => {
    localStorage.removeItem('re_login_code');
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
    socket?.close();
    socket = null;
}

// export const sendData = (data: any) => {
//     socket?.send(JSON.stringify(data))
// };
export const sendData = (data: any) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(data));
    } else {
        console.warn("Socket not ready");
    }
};
export const getSocket = () => socket;

// Lấy danh sách user list
export const getUserList = () => {
    sendData({
        action: "onchat",
        data: { event: "GET_USER_LIST" }
    });
};

// Tạo phòng
export const createRoom = (roomName: string) => {
    sendData({
        action: "onchat",
        data: {
            event: "CREATE_ROOM",
            data: { name: roomName }
        }
    });
};

// Tham gia phòng
export const joinRoom = (roomName: string) => {
    sendData({
        action: "onchat",
        data: {
            event: "JOIN_ROOM",
            data: { name: roomName }
        }
    });
};

// Gửi tin nhắn
export const sendChatMessage = (type: 'people' | 'room', to: string, mes: string) => {
    // Gửi lên server
    sendData({
        action: "onchat",
        data: {
            event: "SEND_CHAT",
            data: { type, to, mes }
        }
    });

    // Optimistic Update: Hiển thị ngay phía client (tùy chọn)
    const currentUser = localStorage.getItem('user') || '';
    store.dispatch(receiveMessage({
        from: currentUser,
        to: to,
        mes: mes,
        type: type,
        createAt: new Date().toISOString()
    }));
};

// Lấy lịch sử chat cá nhân
export const getPeopleChatMes = (partnerName: string, page: number = 1) => {
    sendData({
        action: "onchat",
        data: {
            event: "GET_PEOPLE_CHAT_MES",
            data: { name: partnerName, page }
        }
    });
};

// Lấy lịch sử chat phòng
export const getRoomChatMes = (roomName: string, page: number = 1) => {
    sendData({
        action: "onchat",
        data: {
            event: "GET_ROOM_CHAT_MES",
            data: { name: roomName, page }
        }
    });
};

// Kiểm tra user online
export const checkUserOnline = (userId: string) => {
    sendData({
        action: "onchat",
        data: {
            event: "CHECK_USER_ONLINE",
            data: { user: userId }
        }
    });
};
export const checkUserExist = (username: string): Promise<boolean> => {
    return new Promise((resolve) => {
        const handleMessage = (e: MessageEvent) => {
            const res = JSON.parse(e.data);

            if (res.event === "CHECK_USER_EXIST") {
                socket?.removeEventListener('message', handleMessage);

                const exists = res.status === "success" &&
                    (res.data.status === true || res.data.status === "true");

                resolve(exists);
            }
        };

        socket?.addEventListener('message', handleMessage);

        sendData({
            action: "onchat",
            data: {
                event: "CHECK_USER_EXIST",
                data: { user: username }
            }
        });
    });
};
