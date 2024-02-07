import { Injectable } from "@angular/core";
import { Action, State, StateContext } from "@ngxs/store";
import { GetProducts } from "../actions/products.action";
import { ApiService } from "../../services/api.service";
import { tap } from "rxjs";
import { FeTiProduct } from "../../schema/interfaces/products.interface";
import { ProductsHelper } from "../../schema/models/products.model";

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
    constructor(private apiService: ApiService
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