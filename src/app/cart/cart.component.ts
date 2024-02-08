import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { Address, UserDetails } from 'src/modules/auth/schema/interfaces/user.interface';
import { AuthSelectors } from 'src/modules/auth/store/selectors/auth.selector';
import { AddToCart, GetCartItems } from '../store/actions/cart.action';
import { HttpErrorResponse } from '@angular/common/http';
import { CartItem, UserCart } from 'src/modules/products/schema/interfaces/cart.interface';
import { SizeChart } from 'src/modules/shared/app.constants';
import { cartHelper } from 'src/modules/products/helper/cart.helper';
import { SharedService } from 'src/modules/shared/services/shared.service';
import { CartSelectors } from '../store/selectors/cart.selector';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  userId = null;
  readonly subs: Array<Subscription> = [];
  fetching = true;
  showError = false;
  errorMsg = null;
  cartItemsLength = 0;
  cartItems: CartItem[] = null;
  sizeChart = SizeChart;
  totalAmount = null;
  userDetails: UserDetails = null;
  @Select(CartSelectors.GetCartItems) getCartItems$: Observable<any>;
  address: Address = null;

  @Select(AuthSelectors.GetIsUserLoggedIn) isLoggedIn$: Observable<any>;

  constructor(private store: Store, private router: Router, private sharedService: SharedService) { }

  ngOnInit(): void {
    this.subs.push(
      this.isLoggedIn$.subscribe(res => {
        console.log("cart", res)
        this.isLoggedIn = res.isLoggedIn;
        this.userId = res.userId;
        if (!this.isLoggedIn) {
          const access_token = window.sessionStorage.getItem('access_token');
          console.log("Access", access_token)
          if (access_token) {
            this.isLoggedIn = true;
          } else {
            this.router.navigateByUrl('/auth/login')
          }
        }
        if (!!this.userId) {
          console.log("userID", this.userId)
          this.getCartItems(this.userId);
        }
      })
    );
  }
  getCartItems(userId) {
    this.subs.push(
      this.store.dispatch(new GetCartItems(userId)).subscribe(res => {
        this.cartItemsLength = res.Cart.cartItems.length;
        this.cartItems = res.Cart.cartItems;
        this.totalAmount = this.cartItems.reduce((acc, item) => acc + item.quantity * (+item.price), 0)

        this.userDetails = res.User.userDetails;
        this.address = this.userDetails.addresses.filter(add => add.isDefault == true)[0];
        this.fetching = false;
        console.log("cartItems", this.address)
      },
        (error: HttpErrorResponse) => {
          console.error('error: ', error);
          this.fetching = false;
          this.showError = true;
          this.errorMsg = "Something went wrong! please try again!"
        })
    )
    this.subs.push(
      this.getCartItems$.subscribe(res => {
        console.log("carttt", res)
        this.cartItemsLength = res.length;
        this.cartItems = res;
        this.totalAmount = this.cartItems.reduce((acc, item) => acc + item.quantity * (+item.price), 0)
      })
    )
  }
  shop() {
    this.router.navigateByUrl('/products');
  }
  increaseQuantity(cartItem: CartItem): void {
    console.log("carritem", cartItem);
    if (cartItem.quantity < 10) {
      const res: UserCart = {
        userId: this.store.selectSnapshot(AuthSelectors.GetUserId).userId,
        cartItems: cartHelper([...this.cartItems], { ...cartItem, quantity: 1 })
      }
      this.updateCart(res);
    }
  }

  decreaseQuantity(cartItem: CartItem): void {
    if (cartItem.quantity > 1) {
      const res: UserCart = {
        userId: this.store.selectSnapshot(AuthSelectors.GetUserId).userId,
        cartItems: cartHelper([...this.cartItems], { ...cartItem, quantity: -1 })
      }
      this.updateCart(res);
    }
  }
  updateCart(res) {
    this.fetching = true;
    this.subs.push(
      this.store.dispatch(new AddToCart(res)).subscribe(res => {
        this.fetching = false;
      },
        (error: HttpErrorResponse) => {
          console.error('error: ', error);
          this.fetching = false;
          this.sharedService.showErrors("'Something went wrong! please try again!'");
        })
    );
    console.log("updated", res)
  }
  ngOnDestroy() {
    this.subs.forEach((data) => data.unsubscribe());
  }
}
