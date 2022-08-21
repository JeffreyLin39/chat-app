export interface IAccountRegistration {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	_id?: string;
}

export interface IAccountLogin {
	email: string;
	password: string;
}
