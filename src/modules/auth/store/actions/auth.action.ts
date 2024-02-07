import { UserDetails } from "../../schema/interfaces/user.interface";

export class Login {
    static readonly type = '[Login] Login';
    constructor(public payload: { username: string, password: string }) { }
}
export class Logout {
    static readonly type = '[Logout] Logout';
}
export class SignUp {
    static readonly type = '[SignUp] SignUp';
    constructor(public payload: any) { }
}
export class SetIsLoggedIn {
    static readonly type = '[SignUp] Set Is Logged In ';
    constructor(public isLoggedIn: Boolean) { }
}