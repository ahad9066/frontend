import { Selector } from '@ngxs/store';
import { CartState, CartStateModel } from '../state/cart.state';

export class CartSelectors {
    @Selector([CartState])
    static GetCartItems(state: CartStateModel) {
        return state.cartItems;
    }
    @Selector([CartState])
    static GetOrderList(state: CartStateModel) {
        return state.orderList;
    }
}
