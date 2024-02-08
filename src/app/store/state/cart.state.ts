import { Injectable } from "@angular/core";
import { Action, State, StateContext, Store } from "@ngxs/store";
import { ApiService } from "../../services/api.service";
import { tap } from "rxjs";
import { CartItem } from "src/modules/products/schema/interfaces/cart.interface";
import { AddToCart, GetCartItems, UpdateCartItems } from "../actions/cart.action";
import { SharedService } from "src/modules/shared/services/shared.service";

export class CartStateModel {
    cartItems: CartItem[] | [];
}
@State<CartStateModel>({
    name: 'Cart',
    defaults: {
        cartItems: [],
    },
})
@Injectable()
export class CartState {
    constructor(private apiService: ApiService,
        private sharedService: SharedService,
        private store: Store
    ) {
    }

    @Action(GetCartItems)
    getCartItems(
        { patchState }: StateContext<CartStateModel>,
        { payload }: GetCartItems
    ) {
        return this.apiService.getCartItems(payload).pipe(
            tap(
                (res: { userId: string, cartItems: CartItem[] }) => {
                    patchState({
                        cartItems: res.cartItems,
                    });
                },
                (error) => {
                    return error;
                }
            )
        );
    }
    @Action(UpdateCartItems)
    updateCartItems(
        { patchState }: StateContext<CartStateModel>,
        { cartItems }: UpdateCartItems
    ) {
        console.log("payloaddd", cartItems)
        patchState({
            cartItems: cartItems,
        });
    }
    @Action(AddToCart)
    addToCart(
        { patchState }: StateContext<CartStateModel>,
        { payload }: AddToCart
    ) {
        return this.apiService.addToCart(payload).pipe(
            tap(
                (res) => {
                    console.log("sattt", payload, payload.cartItems.length)
                    this.store.dispatch(new UpdateCartItems(payload.cartItems))
                    // this.dataService.addItemToCart(payload.cartItems.length);
                    this.sharedService.showSuccess("'Item added to your cart successfully!'");
                },
                (error) => {
                    return error;
                }
            )
        );
    }

}