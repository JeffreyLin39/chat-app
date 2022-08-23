import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface ILoginState {
	isLoggedIn: boolean;
}

const initialState: ILoginState = {
	isLoggedIn: false,
};

export const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		loadLogin: (state, action: PayloadAction<boolean>) => {
			state.isLoggedIn = action.payload;
		},
	},
});

export const { loadLogin } = authSlice.actions;

export default authSlice.reducer;
