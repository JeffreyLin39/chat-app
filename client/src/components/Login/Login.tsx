// React
import * as React from "react";
// Material UI
import { Box, TextField, Typography, Button } from "@mui/material";
// Styles
import {
	boxStyles,
	innerboxStyles,
	inputStyles,
	labelStyles,
	passwordStyles,
	buttonStyles,
} from "./Login.styles";
// Stores
import { useDispatch } from "react-redux";
import { loadLogin } from "../../store/Auth.reducer";

const Login: React.FunctionComponent = () => {
	const [email, setEmail] = React.useState<string>("");
	const [password, setPassword] = React.useState<string>("");
	const [error, setError] = React.useState<boolean>(false);
	const dispatch = useDispatch();
	const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setEmail(event.target.value);
	};

	const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setPassword(event.target.value);
	};

	const logIn = () => {
		if (process.env.REACT_APP_BASE_API_URL) {
			fetch(`${process.env.REACT_BASE_API_URL}/auth/login`, {
				method: "POST",
				body: JSON.stringify({ email, password }),
			})
				.then((response: any) => {
					if (response.status === 200) {
						dispatch(loadLogin(true));
					} else {
						setError(true);
					}
				})
				.catch((error: any | unknown) => {
					setError(true);
					console.error(error);
				});
		}
	};
	return (
		<Box sx={boxStyles}>
			<Box sx={innerboxStyles}>
				<Typography variant="h2" component="span" sx={labelStyles}>
					Login
				</Typography>
				<TextField
					id="outlined-basic"
					label="Email"
					variant="outlined"
					sx={inputStyles}
					value={email}
					onChange={handleEmailChange}
					error={error}
				/>
				<TextField
					id="outlined-basic"
					label="Password"
					variant="outlined"
					type="password"
					sx={inputStyles}
					value={password}
					onChange={handlePasswordChange}
					error={error}
				/>
				<Button
					sx={buttonStyles}
					onClick={logIn}
					disabled={email.length === 0 || password.length === 0}
				>
					Login
				</Button>
				<Typography variant="h6" component="span" sx={passwordStyles}>
					Create an Account
				</Typography>
			</Box>
		</Box>
	);
};

export default Login;
