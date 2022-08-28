// React
import * as React from "react";
// React router
import { useParams, useNavigate } from "react-router-dom";
// Material UI
import { Box, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// Styles
import {
	boxStyles,
	buttonStyles,
	messageBoxStyles,
	senderStyles,
} from "./Chat.styles";
// Store
import { useSelector } from "react-redux";
import { RootState } from "../../store/Auth.store";
// Interfaces
import { IAccountRegistration, IChat } from "../Dashboard";
// Socket
import { io } from "socket.io-client";
const Chat: React.FunctionComponent = () => {
	//TODO: show loading screen if login is false
	const params = useParams();
	const navigate = useNavigate();
	const user: IAccountRegistration | undefined = useSelector(
		(state: RootState) => state.AuthReducer.user
	);

	const [value, setValue] = React.useState<string>("");
	const [chat, setChat] = React.useState<IChat>();
	const socket = React.useRef(io("ws://localhost:8800"));

	const sendMessage = () => {
		if (process.env.REACT_APP_BASE_API_URL && user?._id) {
			fetch(
				`${process.env.REACT_APP_BASE_API_URL}/groups/sendMessage/${params.id}`,
				{
					method: "PUT",
					headers: {
						Accept: "application/json",
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						sender: user.email,
						value: value,
					}),
				}
			).then(() => {
				setValue("");
			});
		}
	};

	React.useEffect(() => {
		if (process.env.REACT_APP_BASE_API_URL) {
			fetch(`${process.env.REACT_APP_BASE_API_URL}/groups/getChat/${params.id}`)
				.then((response) => response.json())
				.catch((error) => console.error(error))
				.then((response) => {
					setChat(response.data.chat);
				})
				.catch((error) => console.error(error));
		}
	}, [params.id]);

	React.useEffect(() => {
		socket.current.on(`${params.id}`, (chat) => {
			setChat(chat);
		});
	}, [params.id]);

	return (
		<>
			<ArrowBackIcon
				sx={{
					position: "absolute",
					fontSize: "3rem",
					margin: "10px",
					cursor: "pointer",
				}}
				onClick={() => {
					navigate("/");
				}}
			/>
			<Box sx={boxStyles}>
				{chat?.chat.map((value, idx) => (
					<Box key={idx}>
						<Box sx={senderStyles}>{value.sender}</Box>
						<Box sx={messageBoxStyles}>{value.value}</Box>
					</Box>
				))}
			</Box>
			<textarea
				value={value}
				style={{
					position: "absolute",
					resize: "none",
					bottom: "10%",
					width: "19%",
					margin: "0.5%",
					height: "15%",
				}}
				onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
					setValue(event.target.value);
				}}
			/>
			<Button
				sx={buttonStyles}
				onClick={sendMessage}
				disabled={value.length === 0}
			>
				Send
			</Button>
		</>
	);
};

export default Chat;
