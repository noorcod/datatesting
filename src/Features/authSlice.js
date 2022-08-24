import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import authService from './authService';
import Cookies from './Cookies';

const initialState = {
    user: null,
    error: false,
    message: ""
}

// Login User
export const login = createAsyncThunk('/auth/login-tech-bazaar-user', async (user, thunkApi) => {
    try {
        const res = await authService.login(user);
        if(res.user.user_type === 'data') {
            return res;
        } else {
            return thunkApi.rejectWithValue("Invalid email/password!");
        }
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.error.message) ||
        error.message ||
        error.toString() ||
        error.payload.message;
      return thunkApi.rejectWithValue(message);
    }
});

export const currentUser = createAsyncThunk('/user/get-tech-user-by-accesstoken', async(refreshToken,thunkApi)=> {
    try {
        const res = await authService.getUser(refreshToken);
        if(res.user_type === 'data') {
            return res;
        } else {
            return thunkApi.rejectWithValue("Invalid email/password!");
        }
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.error.message) ||
        error.message ||
        error.toString();
      return thunkApi.rejectWithValue(message);
    }
})

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state,action)=>{
            state.user = action.payload.user.user
        },
        logout:(state,action)=>{
            state.user = null;
            Cookies.remove('accessToken');
        },
        addUser:(state, action)=> {
            state.user = action.payload
        }

    },
    extraReducers: (builder) => {
        builder
            .addCase(login.fulfilled, (state, action) => {
                state.user = action.payload.user
            })
            .addCase(login.rejected, (state, action) => {
                state.user = null
                state.error = true
                state.message = action.payload
            })
            .addCase(currentUser.fulfilled, (state, action)=> {
                state.user = action.payload
            })
    }
});

export const authActions = authSlice.actions;
export default authSlice.reducer;