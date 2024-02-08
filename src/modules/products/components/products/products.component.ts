import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  productsList = [
    {
      img: "./assets/images/standard_grain.png",
      name: "Standard: 10 - 50 mm",
      code: "STD_10_50"
    },
    {
      img: "./assets/images/medium_grain.png",
      name: "Medium: 10 - 30 mm",
      code: "MED_10_30"
    },
    {
      img: "./assets/images/small_grain.png",
      name: "Small: 4 - 10 mm",
      code: "SML_4_10"
    },
    {
      img: "./assets/images/fine_grain.png",
      name: "Fines : 0 - 2 mm",
      code: "FIN_0_2"
    }
  ]

  constructor(private router: Router) { }

  ngOnInit(): void {
  }
  viewDetails(productCode) {
    this.router.navigateByUrl(`/products/${productCode}`);
  }
}
