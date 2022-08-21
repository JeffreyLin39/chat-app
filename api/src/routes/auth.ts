import { IAccountRegistration, IAccountLogin } from "../interfaces/accounts";
import e, { Request, Response } from "express";
const bcrypt = require("bcrypt");
const router = require("express").Router();
const Account = require("../models/account");
router.post(
	"/register",
	async (req: Request<unknown, IAccountRegistration>, res: Response) => {
		try {
			const { firstName, lastName, email, password } = req.body;
			if (!firstName || !lastName || !email || !password) {
				throw Error("Invalid or missing parameters...");
			}

			const salt = await bcrypt.genSalt(10);
			const encryptedPassword = await bcrypt.hash(password, salt);
			const account = new Account({
				firstName: firstName,
				lastName: lastName,
				email: email,
				password: encryptedPassword,
				chat: [],
			});
			account
				.save()
				.then((response: any) => {
					res.status(200).json({
						status: 200,
						message: "Action accepted",
						data: { UID: response._id.toString() },
					});
				})
				.catch((error: any | unknown) => {
					console.error(error);
					res.status(500).json({ status: 500, message: error.toString() });
				});
		} catch (error: any | unknown) {
			console.error(error);
			res.status(400).json({ status: 400, message: error.toString() });
		}
	}
);

router.post(
	"/login",
	async (req: Request<unknown, IAccountLogin>, res: Response) => {
		try {
			const { email, password } = req.body;
			if (!email || !password) {
				throw Error("Invalid or missing parameters...");
			}
			const user: IAccountRegistration = await Account.findOne({
				email: email,
			});
			if (!user) {
				throw Error("Password or email is incorrect...");
			}
			bcrypt
				.compare(password, user.password)
				.then((response: any) => {
					if (response) {
						res.status(200).json({
							status: 200,
							message: "Action accepted",
							data: { UID: user._id.toString() },
						});
					} else {
						throw Error("Password or email is incorrect...");
					}
				})
				.catch((error: any | unknown) => {
					console.log(error);
					res.status(400).json({ status: 400, message: error.toString() });
				});
		} catch (error: any | unknown) {
			console.error(error);
			res.status(400).json({ status: 400, message: error.toString() });
		}
	}
);
module.exports = router;

router.get("/getAccount/:id", async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const account = await Account.findOne({ _id: id });
		if (account) {
			res.status(200).json({
				status: 400,
				message: "Action accepted",
				data: { account: account },
			});
		} else {
			throw Error("Invalid parameters or account not found...");
		}
	} catch (error: any | unknown) {
		console.error(error);
		res.status(400).json({ status: 400, message: error.toString() });
	}
});

router.delete("/deleteAccount/:id", async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const deleted = await Account.findByIdAndDelete(id);
		if (deleted) {
			res.status(200).json({
				status: 400,
				message: "Action accepted",
			});
		} else {
			throw Error("Invalid parameters or account not found...");
		}
	} catch (error: any | unknown) {
		console.error(error);
		res.status(400).json({ status: 400, message: error.toString() });
	}
});

router.put("/updateAccount/:id", async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const { firstName, lastName, email, password } = req.body;
		let encryptedPassword: string;
		if (password) {
			const salt = await bcrypt.genSalt(10);
			encryptedPassword = await bcrypt.hash(password, salt);
		}
		const updated = await Account.updateOne(
			{ _id: id },
			{
				$set: {
					firstName: firstName,
					lastName: lastName,
					email: email,
					password: encryptedPassword,
				},
			}
		);
		if (updated) {
			res.status(200).json({
				status: 400,
				message: "Action accepted",
			});
		} else {
			throw Error("Invalid parameters or account not found...");
		}
	} catch (error: any | unknown) {
		console.error(error);
		res.status(400).json({ status: 400, message: error.toString() });
	}
});

// TODO: Add endpoint for getting user, deleting user, updating user
