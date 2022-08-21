export interface INewChat {
	owner: string;
	members: string[];
}
export interface IChat {
	owner: string;
	members: string[];
	chat: [
		{
			sender: string;
			value: string;
		}
	];
}

export interface IMembers {
	members: string[];
}
