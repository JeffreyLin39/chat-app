export interface IAccountRegistration {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
}

export interface IAccountLogin {
	email: string;
	password: string;
}
