// React
import * as React from "react";
// React Router
import { useNavigate } from "react-router-dom";
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
} from "./Register.styles";
// Stores
import { useDispatch } from "react-redux";
import { loadLogin, loadUser } from "../../store/Auth.reducer";

const Register: React.FunctionComponent = () => {
	const navigate = useNavigate();
	const [firstName, setFirstName] = React.useState<string>("");
	const [lastName, setLastName] = React.useState<string>("");
	const [email, setEmail] = React.useState<string>("");
	const [password, setPassword] = React.useState<string>("");
	const [error, setError] = React.useState<boolean>(false);
	const [focused, setFocused] = React.useState(false);

	const dispatch = useDispatch();

	const handleFirstNameChange = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		setError(false);
		setFirstName(event.target.value);
	};

	const handleLastNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setError(false);
		setLastName(event.target.value);
	};

	const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setError(false);
		setEmail(event.target.value);
	};

	const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setError(false);
		setPassword(event.target.value);
	};

	const register = async () => {
		if (process.env.REACT_APP_BASE_API_URL) {
			fetch(`${process.env.REACT_APP_BASE_API_URL}/auth/register`, {
				method: "POST",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ firstName, lastName, email, password }),
			})
				.then((response: any) => {
					if (response.status === 200) {
						navigate("/");
						dispatch(loadLogin(true));
						return response.json();
					} else {
						setError(true);
					}
				})
				.catch((error: any | unknown) => {
					setError(true);
					console.error(error);
				})
				.then((response) => {
					dispatch(loadUser(response.data.user));
				})
				.catch((error: any | unknown) => {
					setError(true);
					console.error(error);
				});
		}
	};

	React.useEffect(() => {
		if (
			!focused &&
			email.length !== 0 &&
			(!email.includes("@") ||
				email.lastIndexOf(".") - email.indexOf("@") < 2 ||
				email.slice(-1) === "." ||
				email.charAt(0) === "@")
		) {
			setError(true);
		}
	}, [focused, email]);

	return (
		<Box sx={boxStyles}>
			<Box sx={innerboxStyles}>
				<Typography variant="h2" component="span" sx={labelStyles}>
					Register
				</Typography>
				<TextField
					id="outlined-basic"
					label="First Name"
					variant="outlined"
					sx={inputStyles}
					value={firstName}
					onChange={handleFirstNameChange}
					error={error}
				/>
				<TextField
					id="outlined-basic"
					label="Last Name"
					variant="outlined"
					type="password"
					sx={inputStyles}
					value={lastName}
					onChange={handleLastNameChange}
					error={error}
				/>
				<TextField
					id="outlined-basic"
					label="Email"
					variant="outlined"
					sx={inputStyles}
					value={email}
					onChange={handleEmailChange}
					error={error}
					onFocus={() => setFocused(true)}
					onBlur={() => setFocused(false)}
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
					onClick={register}
					disabled={email.length === 0 || password.length === 0 || error}
				>
					Register
				</Button>
				<Typography
					variant="h6"
					component="span"
					sx={passwordStyles}
					onClick={() => {
						navigate("/login");
					}}
				>
					Login
				</Typography>
			</Box>
		</Box>
	);
};

export default Register;
