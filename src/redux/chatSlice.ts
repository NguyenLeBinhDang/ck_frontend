import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {getMessagePreview, getMessageType} from '../services/messageService';

interface Conversation {
    id: string;
    name: string;
    avatar: string;
    lastMessage: string;
    time: string;
    unreadCount: number;
    isOnline: boolean;
    type: 'people' | 'room';
}

export interface Message {
    id?: string;
    from: string;
    to: string;
    mes: string;
    type: 'people' | 'room';
    createAt: string;
    messageType?: 'text' | 'image' | 'file' | 'gif';
    fileInfo?: {
        name: string;
        size: number;
        mimeType: string;
        url?: string;
    };
}

interface ChatState {
    conversations: Conversation[];
    activeId: string | null; // ID của hội thoại đang mở
    messages: { [key: string]: Message[] }; // Lưu tin nhắn theo ID hội thoại: { "user1": [msg1, msg2] }
}

const initialState: ChatState = {
    conversations: [],
    activeId: null,
    messages: {},
};

export const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        // Chọn hội thoại để chat
        setActiveConversation: (state, action: PayloadAction<string>) => {
            state.activeId = action.payload;
            // Khi click vào, reset số tin nhắn chưa đọc về 0
            const conv = state.conversations.find(c => c.id === action.payload);
            if (conv) conv.unreadCount = 0;
        },

        // Cập nhật danh sách user từ API GET_USER_LIST
        setConversations: (state, action: PayloadAction<any[]>) => {
            state.conversations = action.payload.map((user: any) => ({
                id: user.name,
                name: user.name,
                avatar: `https://ui-avatars.com/api/?name=${user.name}&background=random`,
                lastMessage: "Chưa có tin nhắn",
                time: user.actionTime ? new Date(user.actionTime).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                }) : "",
                unreadCount: 0,
                isOnline: false,
                type: user.type === 0 ? 'people' : 'room'
            }));
        },

        // Cập nhật trạng thái online cảu user
        updateUserStatus: (state, action: PayloadAction<{ id: String, isOnline: boolean }>) => {
            const {id, isOnline} = action.payload
            const conv = state.conversations.find(c => c.id === id);
            if (conv) conv.isOnline = isOnline;

        },

        addConversation: (state, action: PayloadAction<Conversation>) => {
            const existing = state.conversations.find(c => c.id === action.payload.id);
            if (!existing) {
                state.conversations.unshift(action.payload);
            }
        },


        setMessages: (state, action: PayloadAction<{ messages: any[], isHistory?: boolean }>) => {
            const {messages} = action.payload;
            if (!messages || messages.length === 0) return;

            const currentUser = localStorage.getItem('user') || '';
            const firstMsg = messages[0];

            // Kiểm tra xem phải tin nhắn của mình hay không
            const isMyMessage = firstMsg.name === currentUser;

            // Xác định ID hội thoại từ dữ liệu tin nhắn
            let conversationId = "";

            // Kiểm tra xem đây là tin nhắn nhóm hay cá nhân dựa trên type hoặc ngữ cảnh
            const msgType = (firstMsg.type === 0 || firstMsg.type === 1) ? 'people' : 'room';

            if (msgType === 'room') {
                // Với Room, 'to' là tên phòng
                conversationId = firstMsg.to;
            } else {
                // name là người gửi to là người nhận
                conversationId = isMyMessage ? firstMsg.to : firstMsg.name;
            }

            // Fallback: Nếu không tìm được từ tin nhắn, dùng activeId hiện tại
            if (!conversationId && state.activeId) {
                conversationId = state.activeId;
            }
            const conv = state.conversations.find(c => c.id === conversationId);
            if (conv) {
                //cập nhật preview
                conv.lastMessage = isMyMessage ? "Bạn: " + getMessagePreview(firstMsg.mes) : getMessagePreview(firstMsg.mes);
                conv.time = firstMsg.createAt;
            }
            if (conversationId) {
                //Map dữ liệu API sang format UI
                const formattedMessages: Message[] = messages.map((m: any) => ({
                    id: m.id,
                    from: m.name,
                    to: m.to,
                    mes: m.mes,
                    type: (m.type === 0 || m.type === 1) ? 'people' : 'room',
                    createAt: m.createAt,
                    messageType: getMessageType(m.mes)
                }));

                // Reverse lại để tin nhắn cũ nhất nằm ở index 0
                state.messages[conversationId] = formattedMessages.reverse();

            }
        },

        // Xử lý tin nhắn đến
        receiveMessage: (state, action: PayloadAction<any>) => {
            const {from, to, mes, type, createAt} = action.payload;

            // Lấy ID người dùng hiện tại
            const currentUser = localStorage.getItem('user') || '';
            // Kiểm tra xem phải tin nhắn của mình hay không
            const isMyMessage = from === currentUser;

            let conversationId = "";
            if (type === 'room') {
                conversationId = to;
            } else {
                conversationId = from === currentUser ? to : from;
            }

            // Thêm tin nhắn vào lịch sử chat
            if (!state.messages[conversationId]) {
                state.messages[conversationId] = [];

            }
            const messageType = getMessageType(mes);

            const newMessage: Message = {
                from,
                to,
                mes,
                type,
                createAt: createAt || new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}),
                messageType
            };

            state.messages[conversationId].push(newMessage);

            // Cập nhật preview ở danh sách bên trái
            const convIndex = state.conversations.findIndex(c => c.id === conversationId);

            if (convIndex !== -1) {
                const targetConv = state.conversations[convIndex];

                // Cập nhật last message
                targetConv.lastMessage = isMyMessage ? 'Bạn:' + getMessagePreview(mes) : getMessagePreview(mes);
                targetConv.time = newMessage.createAt;

                // Tăng unreadCount nếu tin nhắn đến từ người khác Vvà mình đang không mở hội thoại đó
                if (from !== currentUser && state.activeId !== conversationId) {
                    targetConv.unreadCount += 1;
                }

                // Đưa hội thoại lên đầu danh sách
                state.conversations.splice(convIndex, 1);
                state.conversations.unshift(targetConv);
            }
        },
    },
});

export const {
    setActiveConversation,
    setConversations,
    receiveMessage,
    setMessages,
    updateUserStatus,
    addConversation
} = chatSlice.actions;
export default chatSlice.reducer;