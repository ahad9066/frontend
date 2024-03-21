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
export class DeleteCartItems {
    static readonly type = '[Cart] Delete Cart Items';
    constructor(public payload: { userId: string }) { }
}



export class PlaceOrder {
    static readonly type = '[Cart] Place Order';
    constructor(public payload: any) { }
}
export class GetOrdersList {
    static readonly type = '[Orders] Get Orders List';
    constructor(public payload: { userId: string }) { }
}

export class CancelOrder {
    static readonly type = '[Orders] Cancel Order';
    constructor(public payload: { orderId: string }) { }
}