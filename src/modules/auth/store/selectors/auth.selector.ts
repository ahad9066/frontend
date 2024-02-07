import { Selector } from '@ngxs/store';
import { AuthState, AuthStateModel } from '../state/auth.state';

export class AuthSelectors {
    @Selector([AuthState])
    static GetIsUserLoggedIn(state: AuthStateModel) {
        return state.isLoggedIn;
    }
}
