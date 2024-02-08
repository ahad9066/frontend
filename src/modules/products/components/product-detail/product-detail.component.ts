import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { Composition, FeTiProduct, SubGrades } from '../../schema/interfaces/products.interface';
import { Subscription } from 'rxjs';
import { GetProducts } from '../../store/actions/products.action';
import { HttpErrorResponse } from '@angular/common/http';
import { CartItem, UserCart } from '../../schema/interfaces/cart.interface';
import { cartHelper } from '../../helper/cart.helper';
import { SharedService } from 'src/modules/shared/services/shared.service';
import { AuthSelectors } from 'src/modules/auth/store/selectors/auth.selector';
import { CartSelectors } from 'src/app/store/selectors/cart.selector';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { SizeChart } from 'src/modules/shared/app.constants';
import { AddToCart } from 'src/app/store/actions/cart.action';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  readonly subscriptions: Array<Subscription> = [];
  feTiProducts: FeTiProduct[] = [];
  fetching = true;
  showError = false;
  errorMsg = null;
  quantity = 1;
  sizeId;
  sizeChart = SizeChart;
  selectedSubGrade: SubGrades = null;
  selectedProduct: FeTiProduct = null;
  isLoggedIn = false;
  userId = null;
  currentCartItems: CartItem[] = null;
  @ViewChild('addtoCartSuccessTemplate') addtoCartSuccessTemplate!: TemplateRef<any>;

  constructor(private route: ActivatedRoute, private store: Store,
    private router: Router, private sharedService: SharedService,
    private _bottomSheet: MatBottomSheet) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.sizeId = params['sizeId'];
      if (!!this.sizeId) {
        this.getProducts();
      } else {
        this.router.navigateByUrl('/products');
      }
      console.log('Size ID:', this.sizeId);
    });

  }
  getProducts() {
    this.subscriptions.push(
      this.store.dispatch(new GetProducts()).subscribe(
        (res) => {
          console.log('ress', res)
          this.feTiProducts = res.FeTiProducts.products;
          this.selectedSubGrade = this.feTiProducts[0].subGrades[0];
          this.selectedProduct = this.feTiProducts[0];
          this.isLoggedIn = res.User.isLoggedIn;
          this.userId = res.User.userDetails?._id;
          this.currentCartItems = [...res.Cart.cartItems];
          this.fetching = false;
        },
        (error: HttpErrorResponse) => {
          console.error('error: ', error);
          this.fetching = false;
          this.showError = true;
          this.errorMsg = "Something went wrong! please try again!"
        }
      )
    );
  }
  selectedIndexChange(event) {
    console.log("event", event)
    this.selectedSubGrade = this.feTiProducts[event].subGrades[0];
    this.selectedProduct = this.feTiProducts[event];
  }
  increaseQuantity(): void {
    if (this.quantity < 10) {
      this.quantity++;
    }
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }
  continueShopping() {
    this._bottomSheet.dismiss();
  }
  buyNow() {
    this._bottomSheet.dismiss();
    this.router.navigateByUrl('/cart');
  }
  addToCart() {
    if (this.isLoggedIn) {
      const newCartItem = {
        product: {
          id: this.selectedProduct.id,
          name: this.selectedProduct.name
        },
        subGrade: {
          id: this.selectedSubGrade.id,
          name: this.selectedSubGrade.name
        },
        size: {
          id: this.sizeChart[this.sizeId].code,
          name: this.sizeChart[this.sizeId].name
        },
        quantity: this.quantity,
        price: this.selectedSubGrade.price
      }
      this.currentCartItems = this.store.selectSnapshot(CartSelectors.GetCartItems);
      const res: UserCart = {
        userId: this.store.selectSnapshot(AuthSelectors.GetUserId).userId,
        cartItems: cartHelper([...this.currentCartItems], newCartItem)
      }
      console.log("cart items", res)
      this.fetching = true;
      this.subscriptions.push(
        this.store.dispatch(new AddToCart(res)).subscribe(res => {
          this.quantity = 0;
          this.fetching = false;
          this._bottomSheet.open(this.addtoCartSuccessTemplate, { hasBackdrop: false });
        },
          (error: HttpErrorResponse) => {
            console.error('error: ', error);
            this.fetching = false;
            this.sharedService.showErrors("'Something went wrong! please try again!'");
          })
      );

    } else {
      sessionStorage.setItem('previousUrl', window.location.pathname);
      this.router.navigateByUrl('/auth/login')
    }
  }
}
