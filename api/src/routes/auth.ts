import { accountRegistration, accountLogin } from "../interface";
import e, { Request, Response } from "express";
const bcrypt = require("bcrypt");
const router = require("express").Router();
const Account = require("../models/account");
router.post(
	"/register",
	async (
		req: Request<unknown, unknown, unknown, accountRegistration>,
		res: Response
	) => {
		try {
			const { firstName, lastName, email, password } = req.query;
			if (!firstName || !lastName || !email || !password) {
				throw Error("Invalid or missing parameters...");
			}
			const user: accountRegistration = await Account.findOne({ email: email });
			if (user) {
				throw Error("Email current in use...");
			}

			const salt = await bcrypt.genSalt(10);
			const encryptedPassword = await bcrypt.hash(password, salt);
			const account = new Account({
				firstName: firstName,
				lastName: lastName,
				email: email,
				password: encryptedPassword,
			});
			account
				.save()
				.then(() => {
					res.status(200).json({ status: 200, message: "Action accepted" });
				})
				.catch((error: any | unknown) => {
					console.error(error);
					res.status(500).json({ status: 500, message: error });
				});
		} catch (error: any | unknown) {
			console.error(error);
			res.status(400).json({ status: 400, message: error });
		}
	}
);

router.post(
	"/login",
	async (
		req: Request<unknown, unknown, unknown, accountLogin>,
		res: Response
	) => {
		try {
			const { email, password } = req.query;
			if (!email || !password) {
				throw Error("Invalid or missing parameters...");
			}
			const user: accountRegistration = await Account.findOne({ email: email });
			if (!user) {
				throw Error("Password or email is incorrect...");
			}
			bcrypt
				.compare(password, user.password)
				.then((response: any) => {
					if (response) {
						res.status(200).json({ status: 200, message: "Action accepted" });
					} else {
						throw Error("Password or email is incorrect...");
					}
				})
				.catch((error: any | unknown) => {
					console.log(error);
					res.status(400).json({ status: 400, message: error });
				});
		} catch (error: any | unknown) {
			console.error(error);
			res.status(400).json({ status: 400, message: error });
		}
	}
);
module.exports = router;