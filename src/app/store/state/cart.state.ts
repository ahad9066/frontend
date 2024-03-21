import { Injectable } from "@angular/core";
import { Action, State, StateContext, Store } from "@ngxs/store";
import { ApiService } from "../../services/api.service";
import { tap } from "rxjs";
import { CartItem } from "src/modules/products/schema/interfaces/cart.interface";
import { AddToCart, CancelOrder, DeleteCartItems, GetCartItems, GetOrdersList, PlaceOrder, UpdateCartItems } from "../actions/cart.action";
import { SharedService } from "src/modules/shared/services/shared.service";
import { Order } from "src/modules/products/schema/interfaces/order.interface";

export class CartStateModel {
    cartItems: CartItem[] | [];
    orderList: Order[] | [];
}
@State<CartStateModel>({
    name: 'Cart',
    defaults: {
        cartItems: [],
        orderList: []
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


    @Action(DeleteCartItems)
    deleteCartItems(
        { patchState }: StateContext<CartStateModel>,
        { payload }: DeleteCartItems
    ) {
        return this.apiService.deleteCartItems(payload).pipe(
            tap(
                (res) => {
                    this.store.dispatch(new UpdateCartItems([]));
                    this.sharedService.showSuccess("'Order Placed Successfully!'");
                },
                (error) => {
                    return error;
                }
            )
        );
    }

    @Action(PlaceOrder)
    placeOrder(
        { patchState }: StateContext<CartStateModel>,
        { payload }: PlaceOrder
    ) {
        return this.apiService.placeOrder(payload).pipe(
            tap(
                (res) => {
                    console.log("plceOrder", payload)
                    // this.dataService.addItemToCart(payload.cartItems.length);
                    // this.sharedService.showSuccess("'Item added to your cart successfully!'");
                },
                (error) => {
                    return error;
                }
            )
        );
    }

    @Action(GetOrdersList)
    getOrdersList(
        { patchState }: StateContext<CartStateModel>,
        { payload }: GetOrdersList
    ) {
        return this.apiService.getAllOrders(payload).pipe(
            tap(
                (res: { orders: Order[] }) => {
                    patchState({
                        orderList: res.orders,
                    });
                },
                (error) => {
                    return error;
                }
            )
        );
    }
    @Action(CancelOrder)
    cancelOrder(
        { patchState, getState }: StateContext<CartStateModel>,
        { payload }: CancelOrder
    ) {
        return this.apiService.cancelOrder(payload).pipe(
            tap(
                (res: any) => {
                    console.log("cancel order", res)
                    const list = getState().orderList.map(order =>
                        order.orderId == res.orderId ? res : order)
                    patchState({
                        orderList: list
                    });
                },
                (error) => {
                    return error;
                }
            )
        );
    }
}