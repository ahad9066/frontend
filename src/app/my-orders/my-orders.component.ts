import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { AuthSelectors } from 'src/modules/auth/store/selectors/auth.selector';
import { Order } from 'src/modules/products/schema/interfaces/order.interface';
import { CancelOrder, GetOrdersList } from '../store/actions/cart.action';
import { HttpErrorResponse } from '@angular/common/http';
import { SizeChart } from 'src/modules/shared/app.constants';
import { MatDialog } from '@angular/material/dialog';
import { CartSelectors } from '../store/selectors/cart.selector';
import { SharedService } from 'src/modules/shared/services/shared.service';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.scss']
})
export class MyOrdersComponent implements OnInit, OnDestroy {
  @ViewChild('trackTemplate') trackTemplate: TemplateRef<any>;
  isLoggedIn = false;
  userId = null;
  ordersList: Order[] = [];
  fetching = true;
  showError = false;
  errorMsg = null;
  readonly subs: Array<Subscription> = [];
  sizeChart = SizeChart;
  currentOrder: Order = null;
  currentStep = 1;
  @Select(AuthSelectors.GetIsUserLoggedIn) isLoggedIn$: Observable<any>;
  @Select(CartSelectors.GetOrderList) orderList$: Observable<any>;

  constructor(private router: Router, private store: Store,
    private dialog: MatDialog, private sharedService: SharedService) { }

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
          this.getOrderItems(this.userId);
        }
      })
    );
  }
  getOrderItems(userId) {
    this.subs.push(
      this.store.dispatch(new GetOrdersList(userId)).subscribe(res => {
        this.ordersList = res.Cart.orderList;
        this.ordersList = [...this.ordersList].reverse();
        console.log("orderlist", this.ordersList, res.Cart)
        this.fetching = false;
      },
        (error: HttpErrorResponse) => {
          console.error('error: ', error);
          this.fetching = false;
          this.showError = true;
          this.errorMsg = "Something went wrong! please try again!"
        })
    )
    this.subs.push(
      this.orderList$.subscribe(res => {
        this.ordersList = res;
        this.ordersList = [...this.ordersList].reverse();
      })
    );
  }
  shop() {
    this.router.navigateByUrl('/products');
  }
  cancelOrder(orderId) {
    this.fetching = true;
    this.subs.push(
      this.store.dispatch(new CancelOrder(orderId)).subscribe(res => {
        this.sharedService.showSuccess(`Your order with orderID ${orderId} is cancelled successfully!`);
        this.fetching = false;
      },
        (error: HttpErrorResponse) => {
          console.error('error: ', error);
          this.fetching = false;
          this.showError = true;
          this.errorMsg = "Something went wrong! please try again!"
        }))
      ;
  }
  trackOrder(order: Order): void {
    this.currentOrder = order;
    if (this.currentOrder.status == 'payment_initiated') {
      this.currentStep = 1;
    } else if (this.currentOrder.status == 'payment_done') {
      this.currentStep = 2;
    }
    const dialogRef = this.dialog.open(this.trackTemplate, {
      width: '600px',
      height: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog was closed');
    });
  }

  ngOnDestroy() {
    this.subs.forEach((data) => data.unsubscribe());
  }
}
