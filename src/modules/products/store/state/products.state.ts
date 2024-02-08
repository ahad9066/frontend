import { Injectable } from "@angular/core";
import { Action, State, StateContext, Store } from "@ngxs/store";
import { GetProducts } from "../actions/products.action";
import { ApiService } from "../../services/api.service";
import { tap } from "rxjs";
import { FeTiProduct } from "../../schema/interfaces/products.interface";
import { DataService } from "src/modules/shared/services/data.service";
import { SharedService } from "src/modules/shared/services/shared.service";

export class ProductsStateModel {
    products: FeTiProduct[];
}
@State<ProductsStateModel>({
    name: 'FeTiProducts',
    defaults: {
        products: [],
    },
})
@Injectable()
export class ProductsState {
    constructor(private apiService: ApiService,
        private dataService: DataService,
        private sharedService: SharedService,
        private store: Store
    ) {
    }

    @Action(GetProducts)
    login(
        { patchState }: StateContext<ProductsStateModel>,
    ) {
        return this.apiService.getProducts().pipe(
            tap(
                (res: { FeTi: FeTiProduct[] }) => {
                    patchState({
                        products: res.FeTi
                    });
                },
                (error) => {
                    return error;
                }
            )
        );
    }

}