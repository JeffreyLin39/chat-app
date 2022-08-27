import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { IAccountRegistration } from "../components/Dashboard";
export interface ILoginState {
	isLoggedIn: boolean;
	user: IAccountRegistration | undefined;
}

const initialState: ILoginState = {
	isLoggedIn: false,
	user: undefined,
};

export const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		loadLogin: (state, action: PayloadAction<boolean>) => {
			state.isLoggedIn = action.payload;
		},
		loadUser: (state, action: PayloadAction<IAccountRegistration>) => {
			state.user = action.payload;
		},
	},
});

export const { loadLogin, loadUser } = authSlice.actions;

export default authSlice.reducer;
