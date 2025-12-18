import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export interface UserState {
    user: string | null;
    token: string | null;
    isAuthenticated: boolean;
}

const getInitialState = (): UserState => {
    const storedToken = localStorage.getItem("re_login_code");
    const storedUser = localStorage.getItem("user");

    return {
        user: storedUser,
        token: storedToken,
        isAuthenticated: !!storedToken
    }
}

const initialState: UserState = getInitialState();

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login: (state, action: PayloadAction<{ user: string, token: string }>) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
        },

        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
        }
    }
})

export const {login, logout} = userSlice.actions;
export default userSlice.reducer;