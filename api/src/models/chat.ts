import * as mongoose from "mongoose";
const Schema = mongoose.Schema;

const chatSchema = new Schema(
	{
		owner: { type: String, required: true },
		members: [
			{
				email: { type: String, required: true },
				_id: { type: String, required: true },
			},
		],
		chat: [
			{
				sender: { type: String, required: true },
				value: { type: String, required: true },
			},
		],
	},
	{ timestamps: true }
);

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;
