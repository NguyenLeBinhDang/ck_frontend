import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export interface UserState {
    user: string | null;
    token: string | null;
}

const getInitialState = (): UserState => {
    const storedToken = localStorage.getItem("re_login_code");
    const storedUser = localStorage.getItem("user");

    return {
        user: storedUser,
        token: storedToken,
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
        },

        logout: (state) => {
            state.user = null;
            state.token = null;
        }
    }
})

export const {login, logout} = userSlice.actions;
export default userSlice.reducer;