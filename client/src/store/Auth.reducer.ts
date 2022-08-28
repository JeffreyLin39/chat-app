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
		loadChat: (state, action: PayloadAction<string>) => {
			if (state.user) {
				const newUser = state.user;
				newUser.chat = [...state.user?.chat, action.payload];
				state.user = newUser;
			}
		},
	},
});

export const { loadLogin, loadUser, loadChat } = authSlice.actions;

export default authSlice.reducer;
