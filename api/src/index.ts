require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoute = require("./routes/auth");
const groupsRoute = require("./routes/groups");

const app = express();
const port = 8080;
const dbURI = process.env.DBURI;

mongoose
	.connect(dbURI)
	.then(() => {
		console.log("Database connected...");
		app.listen(port, () => {
			console.log("Server is active...");
		});
	})
	.catch((error: any | unknown) => console.error(error));

app.use(morgan("common"));
app.use(express.json());
app.use(cors({ origin: "*" }));

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/groups", groupsRoute);

// TODO: Add socket code
