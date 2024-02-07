import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { Composition, FeTiProduct } from '../../schema/interfaces/products.interface';
import { Subscription } from 'rxjs';
import { GetProducts } from '../../store/actions/products.action';
import { HttpErrorResponse } from '@angular/common/http';

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
  sizeChart = {
    STD: {
      img: "./assets/images/standard_grain.png",
      name: "Standard: 10 - 50 mm",
      code: "STD"
    },
    MED: {
      img: "./assets/images/medium_grain.png",
      name: "Medium: 10 - 30 mm",
      code: "MED"
    },
    SML: {
      img: "./assets/images/small_grain.png",
      name: "Small: 4 - 10 mm",
      code: "SML"
    },
    FINE: {
      img: "./assets/images/fine_grain.png",
      name: "Fines : 0 - 2 mm",
      code: "FINE"
    }
  }
  selectedComposition: Composition[] = null;

  constructor(private route: ActivatedRoute, private store: Store, private router: Router) { }

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
          this.selectedComposition = this.feTiProducts[0].subGrades[0].composition;
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
    this.selectedComposition = this.feTiProducts[event].subGrades[0].composition;
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
}
