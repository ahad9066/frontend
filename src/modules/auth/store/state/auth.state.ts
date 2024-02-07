import { Injectable } from "@angular/core";
import { Action, State, StateContext } from "@ngxs/store";
import { UserDetailsHelper } from "../../schema/models/user.model";
import { UserDetails } from "../../schema/interfaces/user.interface";
import { Login, Logout, SetIsLoggedIn, SignUp } from "../actions/auth.action";
import { ApiService } from "../../services/api.service";
import { tap } from "rxjs";

export class AuthStateModel {
    userDetails: UserDetails;
    isLoggedIn: Boolean;
}
@State<AuthStateModel>({
    name: 'User',
    defaults: {
        userDetails: UserDetailsHelper.createFromResponse({}),
        isLoggedIn: false
    },
})
@Injectable()
export class AuthState {
    constructor(private apiService: ApiService
    ) {
    }

    @Action(Login)
    login(
        { patchState }: StateContext<AuthStateModel>,
        { payload }: Login
    ) {
        return this.apiService.login(payload).pipe(
            tap(
                (res: { token: string, userDetails: UserDetails }) => {
                    window.sessionStorage.setItem('access_token', res.token);
                    patchState({
                        userDetails: res.userDetails,
                        isLoggedIn: true
                    });
                },
                (error) => {
                    return error;
                }
            )
        );
    }
    @Action(SignUp)
    signUp(
        { patchState }: StateContext<AuthStateModel>,
        { payload }: SignUp
    ) {
        console.log('im in state')
        return this.apiService.signUp(payload).pipe(
            tap(
                (r: UserDetails) => {
                    patchState({
                        userDetails: r,
                    });
                },
                (error) => {
                    return error;
                }
            )
        );
    }
    @Action(SetIsLoggedIn)
    setIsLoggedIn(
        { patchState }: StateContext<AuthStateModel>,
        { isLoggedIn }: SetIsLoggedIn
    ) {
        patchState({
            isLoggedIn: isLoggedIn,
        });
    }
    @Action(Logout)
    logout(
        { patchState }: StateContext<AuthStateModel>
    ) {
        return this.apiService.logout().pipe(
            tap(
                (r: UserDetails) => {
                    window.sessionStorage.removeItem('access_token');
                    patchState({
                        userDetails: null,
                        isLoggedIn: false
                    });
                },
                (error) => {
                    return error;
                }
            )
        );
    }
}