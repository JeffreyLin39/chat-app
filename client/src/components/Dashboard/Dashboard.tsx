// React
import * as React from "react";
// Material UI
import { Box, Autocomplete, TextField, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
// Store
import { useSelector } from "react-redux";
import { RootState } from "../../store/Auth.store";

// Styles
import {
	boxStyles,
	inputStyles,
	buttonStyles,
	searchStyles,
	labelStyles,
	labelBoxStyles,
} from "./Dashboard.styles";

export interface IAccountRegistration {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	_id: string;
}

const Dashboard: React.FunctionComponent = () => {
	//TODO: show loading screen if login is false
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

	const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchValue(event.target.value);
	};

	const createChat = () => {
		console.log(user?._id);
		if (user?._id) {
			fetch(`${process.env.REACT_APP_BASE_API_URL}/groups/createChat`, {
				method: "POST",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					owner: user._id,
					members: addedUsers.map((user) => user._id),
				}),
			})
				.then((response: any) => response.json())
				.catch((error) => console.error(error))
				.then((response: any) => {
					console.log(response);
				});
		}
	};
	const handleSetAutofill = (value: string | null) => {
		if (value) {
			setAutofillValue(value);
			const user: IAccountRegistration | undefined = searchResult.find(
				(user) => user.email === value
			);
			if (user && !addedUsers.includes(user)) {
				setAddedUsers([...addedUsers, user]);
			}
		}
	};

	React.useEffect(() => {
		const getSearchResults = setTimeout(() => {
			if (process.env.REACT_APP_BASE_API_URL) {
				fetch(
					`${process.env.REACT_APP_BASE_API_URL}/auth/searchUser?searchQuery=${searchValue}`
				)
					.then((response: any) => response.json())
					.catch((error) => console.error(error))
					.then((response: any) => {
						setSearchOptions(
							response.data.map((user: IAccountRegistration) => user.email)
						);
						setSearchResult(response.data);
					});
			}
		}, 3000);

		return () => clearTimeout(getSearchResults);
	}, [searchValue]);

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
					onClick={(option) => {
						console.log(option);
					}}
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
					onClick={createChat}
					disabled={addedUsers.length === 0}
				>
					Create Chat
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
		</Box>
	) : (
		<></>
	);
};

export default Dashboard;
