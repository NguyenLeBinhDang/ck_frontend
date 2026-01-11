import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export interface UserState {
    user: string | null;
    temp_user: string | null;
    re_login_code: string | null;
}

const getInitialState = (): UserState => {
    const storedToken = localStorage.getItem("re_login_code");
    const storedUser = localStorage.getItem("user");

    return {
        user: storedUser,
        temp_user: null,
        re_login_code: storedToken,
    }
}

const initialState: UserState = getInitialState();

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        loginRequest: (state, action: PayloadAction<string>) => {
            state.temp_user = action.payload;
        },

        loginSuccess: (state, action: PayloadAction<{ re_login_code: string }>) => {
            state.re_login_code = action.payload.re_login_code;

            if (state.temp_user) {
                state.user = state.temp_user;
                state.temp_user = null;
            }
        },

        loginFail: (state) => {
            state.temp_user = null;
        },

        logout: (state) => {
            state.user = null;
            state.temp_user = null;
            state.re_login_code = null;
        }
    }
})

export const {loginRequest, loginFail, loginSuccess, logout} = userSlice.actions;
export default userSlice.reducer;