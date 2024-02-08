import { CartItem } from "src/modules/products/schema/interfaces/cart.interface";


export class GetCartItems {
    static readonly type = '[Cart] Get Cart Items';
    constructor(public payload: { userId: string }) { }
}
export class UpdateCartItems {
    static readonly type = '[Cart] Update Cart Items';
    constructor(public cartItems: CartItem[]) { }
}

export class AddToCart {
    static readonly type = '[Products] Add To Cart';
    constructor(public payload: any) { }
}