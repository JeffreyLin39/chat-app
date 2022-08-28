export interface INewChat {
	owner: string;
	members: string[];
}
export interface IChat {
	owner: string;
	members: [
		{
			email: string;
			_id: string;
		}
	];
	chat: [
		{
			sender: string;
			value: string;
		}
	];
	_id: string;
}

export interface IMembers {
	members: string[];
}
