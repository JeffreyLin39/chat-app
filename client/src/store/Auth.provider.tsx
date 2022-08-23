import * as React from "react";
import { store } from "./Auth.store";
import { Provider } from "react-redux";

interface IAuthProviderProps {
	children: React.ReactNode;
}

export const AuthProvider: React.FunctionComponent<IAuthProviderProps> = (
	props
) => {
	return <Provider store={store}>{props.children}</Provider>;
};
