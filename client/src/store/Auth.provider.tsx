import * as React from "react";
import { useSelector } from "react-redux";
import { RootState } from "./Auth.store";
import { useNavigate, useLocation } from "react-router-dom";
interface IAuthProviderProps {
	children: React.ReactNode;
}

export const AuthProvider: React.FunctionComponent<IAuthProviderProps> = (
	props
) => {
	const isLoggedIn: boolean = useSelector(
		(state: RootState) => state.AuthReducer.isLoggedIn
	);
	// Router
	let navigate = useNavigate();
	const location = useLocation();
	React.useEffect(() => {
		if (
			!isLoggedIn &&
			location.pathname !== "/register" &&
			location.pathname !== "/login"
		) {
			navigate("/login");
		}
	}, [navigate, isLoggedIn, location.pathname]);
	return <>{props.children}</>;
};
