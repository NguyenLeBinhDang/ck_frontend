import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Conversation {
    id: string;
    name: string;
    avatar: string;
    lastMessage: string;
    time: string;
    unreadCount: number;
    isOnline: boolean;
}

interface ChatState {
    conversations: Conversation[];
    activeId: string | null;
}

const initialState: ChatState = {
    conversations: [], // Sẽ được fetch từ API sau này
    activeId: null,
};

export const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setConversations: (state, action: PayloadAction<Conversation[]>) => {
            state.conversations = action.payload;
        },
        setActiveConversation: (state, action: PayloadAction<string>) => {
            state.activeId = action.payload;
            // Khi click vào, reset thông báo chưa đọc (giống Zalo)
            const conv = state.conversations.find(c => c.id === action.payload);
            if (conv) conv.unreadCount = 0;
        },
    },
});

export const { setConversations, setActiveConversation } = chatSlice.actions;
export default chatSlice.reducer;