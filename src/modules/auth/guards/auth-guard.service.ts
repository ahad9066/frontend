import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store } from '@ngxs/store';
import { AuthSelectors } from '../store/selectors/auth.selector'; // Import your AuthSelectors
import { SetIsLoggedIn } from '../store/actions/auth.action';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private store: Store,
        private router: Router
    ) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {
        return this.store.select(AuthSelectors.GetIsUserLoggedIn).pipe(
            map((data: { isLoggedIn: boolean, userId: string }) => {
                if (data.isLoggedIn) {
                    return true;
                } else {
                    const access_token = sessionStorage.getItem('access_token');
                    if (access_token != null) {
                        this.store.dispatch(new SetIsLoggedIn(true));
                        return true;
                    } else {
                        this.store.dispatch(new SetIsLoggedIn(false));
                        this.router.navigateByUrl('/auth/login');
                        return false;
                    }
                }
            })
        );
    }
}

