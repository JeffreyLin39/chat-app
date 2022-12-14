import { IAccountRegistration, IAccountLogin } from "../interfaces/accounts";
import { Request, Response } from "express";
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
				firstName,
				lastName,
				email,
				password: encryptedPassword,
				chat: [],
			});
			account
				.save()
				.then((response: any) => {
					res.status(200).json({
						status: 200,
						message: "Action accepted",
						data: { user: response },
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
							data: { user },
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

router.get("/getAccount/:id", async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		Account.findOne({ _id: id })
			.then((response: any) => {
				res.status(200).json({
					status: 400,
					message: "Action accepted",
					data: { account: response },
				});
			})
			.catch((error: any | unknown) => {
				console.error(error);
				res.status(400).json({ status: 400, message: error.toString() });
			});
	} catch (error: any | unknown) {
		console.error(error);
		res.status(400).json({ status: 400, message: error.toString() });
	}
});

router.delete("/deleteAccount/:id", async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		Account.findByIdAndDelete(id)
			.then(() => {
				res.status(200).json({
					status: 400,
					message: "Action accepted",
				});
			})
			.catch((error: any | unknown) => {
				console.error(error);
				res.status(400).json({ status: 400, message: error.toString() });
			});
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
		Account.updateOne(
			{ _id: id },
			{
				$set: {
					firstName,
					lastName,
					email,
					password: encryptedPassword,
				},
			}
		)
			.then(() => {
				res.status(200).json({
					status: 400,
					message: "Action accepted",
				});
			})
			.catch((error: any | unknown) => {
				console.error(error);
				res.status(400).json({
					status: 400,
					message: error.toString(),
				});
			});
	} catch (error: any | unknown) {
		console.error(error);
		res.status(400).json({ status: 400, message: error.toString() });
	}
});

router.get("/searchUser", async (req: Request, res: Response) => {
	try {
		const { searchQuery } = req.query;

		Account.find({ email: new RegExp(`^${searchQuery}`, "i") })
			.then((result: any) => {
				res
					.status(200)
					.json({ status: 200, message: "Action accepted", data: result });
			})
			.catch((error: any | unknown) => {
				console.error(error);
				res.status(400).json({
					status: 400,
					message: error.toString(),
				});
			});
	} catch (error: any | unknown) {
		console.error(error);
		res.status(400).json({ status: 400, message: error.toString() });
	}
});

module.exports = router;
