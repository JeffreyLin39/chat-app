// React
import * as React from "react";
// React Router
import { useNavigate } from "react-router-dom";
// Material UI
import { Box, Autocomplete, TextField, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
// Store
import { useSelector } from "react-redux";
import { RootState } from "../../store/Auth.store";
import { useDispatch } from "react-redux";
import { loadChat, loadUser } from "../../store/Auth.reducer";

// Styles
import {
	boxStyles,
	inputStyles,
	buttonStyles,
	searchStyles,
	labelStyles,
	labelBoxStyles,
	chatBoxStyles,
	smallChatBoxStyles,
} from "./Dashboard.styles";

export interface IAccountRegistration {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	chat: string[];
	_id: string;
}

export interface IChat {
	owner: string;
	members: [
		{
			email: string;
			_id: string;
		}
	];
	chat: [
		{
			sender: string;
			value: string;
		}
	];
	_id: string;
}

const Dashboard: React.FunctionComponent = () => {
	//TODO: show loading screen if login is false
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const user: IAccountRegistration | undefined = useSelector(
		(state: RootState) => state.AuthReducer.user
	);

	const [searchValue, setSearchValue] = React.useState<string>("");
	const [autofillValue, setAutofillValue] = React.useState<string>("");
	const [searchResult, setSearchResult] = React.useState<
		IAccountRegistration[]
	>([]);
	const [searchOptions, setSearchOptions] = React.useState<string[]>([]);
	const [addedUsers, setAddedUsers] = React.useState<IAccountRegistration[]>(
		[]
	);
	const [chat, setChat] = React.useState<IChat[]>([]);

	const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchValue(event.target.value);
	};

	const createChat = () => {
		if (user?._id) {
			fetch(`${process.env.REACT_APP_BASE_API_URL}/groups/createChat`, {
				method: "POST",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					owner: user._id,
					members: addedUsers.map((user) => ({
						email: user.email,
						_id: user._id,
					})),
				}),
			})
				.then((response: any) => response.json())
				.catch((error) => console.error(error))
				.then((response: any) => {
					dispatch(loadChat(response.data.ID));
					setAddedUsers([]);
				})
				.catch((error) => console.error(error));
		}
	};
	const handleSetAutofill = (value: string | null) => {
		debugger;
		if (value) {
			setAutofillValue("");
			const user: IAccountRegistration | undefined = searchResult.find(
				(user) => user.email === value
			);
			if (user && !addedUsers.includes(user)) {
				setAddedUsers([...addedUsers, user]);
			}
		}
	};

	React.useEffect(() => {
		if (process.env.REACT_APP_BASE_API_URL) {
			fetch(
				`${process.env.REACT_APP_BASE_API_URL}/auth/searchUser?searchQuery=${searchValue}`
			)
				.then((response: any) => response.json())
				.catch((error) => console.error(error))
				.then((response: any) => {
					const array = response.data.map(
						(user: IAccountRegistration) => user.email
					);
					const userIndex = array.indexOf(user?.email);
					if (userIndex > -1) {
						array.splice(userIndex, 1);
					}
					setSearchOptions(array);
					setSearchResult(response.data);
				});
		}
	}, [searchValue, user?.email]);

	React.useEffect(() => {
		const newChats: IChat[] = [];
		if (user?.chat) {
			for (let i = 0; i < user.chat.length; i++) {
				fetch(
					`${process.env.REACT_APP_BASE_API_URL}/groups/getChat/${user.chat[i]}`
				)
					.then((response: any) => response.json())
					.catch((error) => console.error(error))
					.then((response: any) => {
						newChats.push(response.data.chat);
					});
			}
		}
		setTimeout(() => {
			setChat(newChats);
		}, 500);
	}, [user?.chat]);

	return user ? (
		<Box sx={boxStyles}>
			<Box sx={searchStyles}>
				<Autocomplete
					value={autofillValue}
					onChange={(event: any, value: string | null) => {
						handleSetAutofill(value);
					}}
					options={searchOptions}
					sx={{ width: "40%" }}
					freeSolo
					renderInput={(params) => (
						<TextField
							{...params}
							label={"Search users..."}
							id="outlined-basic"
							variant="outlined"
							value={searchValue}
							onChange={handleSearch}
							sx={inputStyles}
						/>
					)}
				/>
				<Button
					sx={buttonStyles}
					onClick={() => {
						createChat();
					}}
					disabled={addedUsers.length === 0}
				>
					Create Chat
				</Button>
				<Button
					sx={buttonStyles}
					onClick={() => {
						setChat([...chat]);
						fetch(
							`${process.env.REACT_APP_BASE_API_URL}/auth/getAccount/${user._id}`
						)
							.then((response) => response.json())
							.catch((error) => console.error(error))
							.then((response) => {
								loadUser(response.data.user);
							})
							.catch((error) => console.error(error));
					}}
				>
					Refresh
				</Button>
			</Box>
			{addedUsers.length > 0 && (
				<Box sx={labelBoxStyles}>
					{addedUsers.map((user: IAccountRegistration) => (
						<Box sx={labelStyles} id={user._id} key={user._id}>
							<span>{user.email}</span>
							<CloseIcon
								sx={{ cursor: "pointer" }}
								onClick={() => {
									setAddedUsers(
										addedUsers.filter(
											(currentUser) => currentUser._id !== user._id
										)
									);
								}}
							/>
						</Box>
					))}
				</Box>
			)}

			{chat.length > 0 ? (
				<Box sx={chatBoxStyles}>
					{chat.map((chat) => (
						<Box
							key={chat._id}
							sx={smallChatBoxStyles}
							onClick={() => {
								navigate(`/chat/${chat._id}`);
							}}
						>
							<Box sx={labelStyles}>
								<span>{user.email}</span>
							</Box>
							{chat.members.map((user) => (
								<Box sx={labelStyles} key={user._id}>
									<span>{user.email}</span>
								</Box>
							))}
						</Box>
					))}
				</Box>
			) : (
				<></>
			)}
		</Box>
	) : (
		<></>
	);
};

export default Dashboard;
