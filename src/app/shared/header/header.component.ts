import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { GetCartItems } from 'src/app/store/actions/cart.action';
import { CartSelectors } from 'src/app/store/selectors/cart.selector';
import { UserDetails } from 'src/modules/auth/schema/interfaces/user.interface';
import { GetUserDetails, Logout, SetIsLoggedIn } from 'src/modules/auth/store/actions/auth.action';
import { AuthSelectors } from 'src/modules/auth/store/selectors/auth.selector';
import { DataService } from 'src/modules/shared/services/data.service';
import { SharedService } from 'src/modules/shared/services/shared.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  userId = null;
  itemList: string[] = [];
  itemListSubscription: Subscription;
  @Select(AuthSelectors.GetIsUserLoggedIn) isLoggedIn$: Observable<any>;
  @Select(CartSelectors.GetCartItems) getCartItems$: Observable<any>;
  subs: Subscription[] = [];
  cartItemsLength = 0;
  constructor(private router: Router, private store: Store, private dataService: DataService,
    private sharedService: SharedService) {
    this.itemListSubscription = this.dataService.itemList$.subscribe(items => {
      console.log("itemListSubscription", items)
      // this.cartItemsLength = +items;
    });
  }

  ngOnInit(): void {
    this.subs.push(
      this.isLoggedIn$.subscribe(res => {
        this.isLoggedIn = res.isLoggedIn;
        this.userId = res.userId;
        if (!this.isLoggedIn) {
          const access_token = window.sessionStorage.getItem('access_token');
          if (access_token) {
            this.store.dispatch(new SetIsLoggedIn(true));
            this.store.dispatch(new GetUserDetails())
            this.isLoggedIn = true;
          }
        }
        if (!!this.userId) {
          console.log("userID", this.userId)
          this.getCartItems(this.userId);
        }
      })
    );
    this.subs.push(
      this.getCartItems$.subscribe(res => {
        console.log("carttt", res)
        this.cartItemsLength = res.length;
      })
    )
  }
  getCartItems(userId) {
    this.subs.push(
      this.store.dispatch(new GetCartItems(userId)).subscribe(res => {
        console.log("result", res)
        this.cartItemsLength = res.Cart.cartItems.length;
      },
        (error: HttpErrorResponse) => {
          console.error('error: ', error);
        })
    )
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
  orders() {
    this.router.navigateByUrl('/orders')
  }
  ngOnDestroy() {
    this.subs.forEach((data) => data.unsubscribe());
  }
}
