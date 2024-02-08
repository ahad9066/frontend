import { Selector } from '@ngxs/store';
import { AuthState, AuthStateModel } from '../state/auth.state';

export class AuthSelectors {
    @Selector([AuthState])
    static GetIsUserLoggedIn(state: AuthStateModel) {
        return {
            isLoggedIn: state.isLoggedIn,
            userId: state.userDetails?._id
        };
    }

    @Selector([AuthState])
    static GetUserDetails(state: AuthStateModel) {
        return { ...state.userDetails };
    }
    @Selector([AuthState])
    static GetUserId(state: AuthStateModel) {
        return { userId: state.userDetails?._id };
    }
}
