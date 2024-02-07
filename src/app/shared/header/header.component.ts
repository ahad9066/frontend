import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { Logout } from 'src/modules/auth/store/actions/auth.action';
import { AuthSelectors } from 'src/modules/auth/store/selectors/auth.selector';
import { SharedService } from 'src/modules/shared/services/shared.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  @Select(AuthSelectors.GetIsUserLoggedIn) isLoggedIn$: Observable<boolean>;
  subs: Subscription[] = [];
  constructor(private router: Router, private store: Store, private sharedService: SharedService) { }

  ngOnInit(): void {
    this.subs.push(
      this.isLoggedIn$.subscribe(res => {
        this.isLoggedIn = res;
        if (!this.isLoggedIn) {
          const access_token = window.sessionStorage.getItem('access_token');
          if (access_token) {
            this.isLoggedIn = true;
          }
        }
      })
    );
  }
  login() {
    this.router.navigateByUrl('/auth/login');
  }
  logout() {
    this.subs.push(
      this.store.dispatch(new Logout()).subscribe(
        () => {
          this.router.navigate(['/auth/login']);
        },
        (error: HttpErrorResponse) => {
          console.error('error: ', error);
          this.sharedService.showErrors("'Something went wrong! please try again!'");
        }
      )
    );
  }
  ngOnDestroy() {
    this.subs.forEach((data) => data.unsubscribe());
  }
}
