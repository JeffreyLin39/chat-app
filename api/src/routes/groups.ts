import { Request, Response } from "express";
import { INewChat } from "../interfaces/chat";
const router = require("express").Router();
const Chat = require("../models/chat");
const Account = require("../models/account");

router.post(
	"/createChat",
	async (req: Request<unknown, INewChat>, res: Response) => {
		try {
			const { owner, members } = req.body;
			if (!owner || !members) {
				throw Error("Invalid or missing parameters");
			}
			const chat = new Chat({
				owner,
				members,
				chat: [],
			});

			chat
				.save()
				.then(async (response: any) => {
					await Account.updateOne(
						{ _id: owner },
						{
							$push: {
								chat: response._id.toString(),
							},
						}
					);
					res.status(200).json({
						status: 200,
						message: "Action accepted",
						data: { ID: response._id.toString() },
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
	}
);

router.put("/addMember/:id", async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const { members } = req.body;
		if (!members) {
			throw Error("Invalid or missing parameters");
		}
		Chat.updateOne(
			{ _id: id },
			{
				$push: {
					members,
				},
			}
		)
			.then(() => {
				res.status(200).json({
					status: 200,
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

router.put("/removeMember/:id", async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const { members } = req.body;
		if (!members) {
			throw Error("Invalid or missing parameters");
		}

		const currentMembers = await Chat.findOne({ _id: id });
		const newMembers = currentMembers.members.filter((member: String) => {
			if (!members.includes(member)) {
				return member;
			}
		});

		Chat.updateOne(
			{ _id: id },
			{
				$set: {
					members: newMembers,
				},
			}
		)
			.then(() => {
				res.status(200).json({
					status: 200,
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

router.get("/getChat/:id", (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		Chat.findOne({ _id: id })
			.then((response: any) => {
				res.status(200).json({
					status: 200,
					message: "Action accepted",
					data: { chat: response },
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

router.put("/sendMessage/:id", async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const { sender, value } = req.body;
		Chat.updateOne(
			{ _id: id },
			{
				$push: {
					chat: {
						sender,
						value,
					},
				},
			}
		)
			.then(() => {
				res.status(200).json({
					status: 200,
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

module.exports = router;
