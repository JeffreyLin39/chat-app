import * as mongoose from "mongoose";
const Schema = mongoose.Schema;

const accountSchema = new Schema(
	{
		firstName: { type: String, required: true },
		lastName: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		chat: { type: [String], required: true },
	},
	{ timestamps: true }
);

const Account = mongoose.model("Account", accountSchema);

module.exports = Account;
