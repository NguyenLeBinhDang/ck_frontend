import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Conversation {
    id: string;
    name: string;
    avatar: string;
    lastMessage: string;
    time: string;
    unreadCount: number;
    isOnline: boolean;
    type:'people' | 'room';
}

export interface Message {
    id?: string;
    from: string;
    to: string;
    mes: string;
    type: 'people' | 'room';
    createAt: string; // Thời gian hiển thị
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
            // API trả về list user object, ta map sang format Conversation của UI
            state.conversations = action.payload.map((user: any) => ({
                id: user.name,
                name: user.name,
                avatar: `https://ui-avatars.com/api/?name=${user.name}&background=random`, // Tạo avatar ngẫu nhiên
                lastMessage: "Chưa có tin nhắn",
                time: user.actionTime ? new Date(user.actionTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "",
                unreadCount: 0,
                isOnline: false,
                type: user.type === 0 ? 'people' : 'room' // API trả type 0 là người
            }));
        },
        updateUserStatus: (state, action: PayloadAction<{id:String,isOnline: boolean }>) => {
            const {id,isOnline} = action.payload
            const conv = state.conversations.find(c => c.id === id);
            if(conv) conv.isOnline = isOnline;

        },
        setMessages: (state, action: PayloadAction<{ messages: any[], isHistory?: boolean }>) => {
            const { messages } = action.payload;
            if (!messages || messages.length === 0) return;

            const currentUser = localStorage.getItem('user') || ''; // dòng này nữa sẽ cập nhât lấy user từ action
            const firstMsg = messages[0];

            // 1. Xác định ID hội thoại từ dữ liệu tin nhắn
            let conversationId = "";

            // Kiểm tra xem đây là tin nhắn nhóm hay cá nhân dựa trên type hoặc ngữ cảnh

            const msgType = (firstMsg.type === 0 || firstMsg.type === 1) ? 'people' : 'room';

            if (msgType === 'room') {
                conversationId = firstMsg.to; // Với Room, 'to' là tên phòng
            } else {
                //name ng gửi to là người nhận
                // Nếu 'name' (người gửi) là mình -> Mình đang chat với 'to'
                // Nếu 'name' (người gửi) là người khác -> Mình đang chat với 'name'
                // hiện tại api chỉ trả vể to.
                conversationId = firstMsg.name === currentUser ? firstMsg.to : firstMsg.name;
            }

            // Fallback: Nếu không tìm được từ tin nhắn (hiếm gặp), dùng activeId hiện tại
            if (!conversationId && state.activeId) {
                conversationId = state.activeId;
            }

            if (conversationId) {
                // 2. Map dữ liệu API sang format UI
                const formattedMessages: Message[] = messages.map((m: any) => ({
                    id: m.id,
                    from: m.name, // API trả về 'name' là người gửi
                    to: m.to,
                    mes: m.mes,
                    type: (m.type === 0 || m.type === 1) ? 'people' : 'room',
                    createAt: m.createAt
                }));

                // 3. Lưu vào store
                // API thường trả tin nhắn mới nhất ở đầu mảng (Index 0 là mới nhất)
                // Nhưng UI Chat thường render từ trên xuống (Cũ -> Mới)
                // Nên ta cần reverse lại để tin nhắn cũ nhất nằm ở index 0
                state.messages[conversationId] = formattedMessages.reverse();
            }
        },

        // Xử lý tin nhắn đến
        receiveMessage: (state, action: PayloadAction<any>) => {
            const { from, to, mes, type,createAt } = action.payload;

            // Lấy ID người dùng hiện tại từ localStorage để biết tin nhắn là ĐẾN hay ĐI
            const currentUser = localStorage.getItem('user') || '';

            let conversationType = "";
            if (type === 'room') {
                conversationType = to;
            } else {
                conversationType = from === currentUser ? to : from;
            }

            // 1. Thêm tin nhắn vào lịch sử chat
            if (!state.messages[conversationType]) {
                state.messages[conversationType] = [];
            }

            const newMessage: Message = {
                from,
                to,
                mes,
                type,
                createAt:createAt|| new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };

            state.messages[conversationType].push(newMessage);

            // 2. Cập nhật Preview ở danh sách bên trái
            const convIndex = state.conversations.findIndex(c => c.id === conversationType);

            if (convIndex !== -1) {
                const targetConv = state.conversations[convIndex];

                // Cập nhật nội dung và thời gian
                targetConv.lastMessage = mes;
                targetConv.time = newMessage.createAt;

                // Tăng unreadCount nếu tin nhắn đến từ người khác VÀ mình đang không mở hội thoại đó
                if (from !== currentUser && state.activeId !== conversationType) {
                    targetConv.unreadCount += 1;
                }

                // 3. Đưa hội thoại lên đầu danh sách (Splice & Unshift)
                state.conversations.splice(convIndex, 1);
                state.conversations.unshift(targetConv);

            }
        },
    },
});

export const { setActiveConversation, setConversations, receiveMessage, setMessages,updateUserStatus } = chatSlice.actions;
export default chatSlice.reducer;