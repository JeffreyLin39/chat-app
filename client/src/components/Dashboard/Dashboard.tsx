// React
import * as React from "react";
// Material UI
import { Box, TextField, Typography, Button } from "@mui/material";
// Styles
import {
	boxStyles,
	inputStyles,
	buttonStyles,
	searchStyles,
} from "./Dashboard.styles";
const Dashboard: React.FunctionComponent = () => {
	//TODO: show loading screen if login is false
	return (
		<Box sx={boxStyles}>
			<Box sx={searchStyles}>
				<TextField
					label={"Search users..."}
					id="outlined-basic"
					variant="outlined"
					sx={inputStyles}
				></TextField>
				<Button sx={buttonStyles}>Create Chat</Button>
			</Box>
		</Box>
	);
};

export default Dashboard;
