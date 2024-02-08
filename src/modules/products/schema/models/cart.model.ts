import { CartItem, UserCart } from "../interfaces/cart.interface";

export class UserCartHelper {
    static createFromResponse(data: {}) {
        return {
            userId: data['userId'] ? data['userId'] : null,
            cartItems: data['cartItems'] ? [...data['cartItems'].map((item: any) => CartItemsHelper.createFromResponse(item))] : []
        } as UserCart;
    }
    static toRequest(addone) {
        const data = this.createFromResponse(addone);
        return Object.assign(data, {});
    }
}

export class CartItemsHelper {
    static createFromResponse(data: {}) {
        return {
            product: data['product'] ? {
                id: data['product']['id'] ? data['product']['id'] : null,
                name: data['product']['name'] ? data['product']['name'] : null,
            } : null,
            subGrade: data['subGrade'] ? {
                id: data['subGrade']['id'] ? data['subGrade']['id'] : null,
                name: data['subGrade']['name'] ? data['subGrade']['name'] : null,
            } : null,
            size: data['size'] ? {
                id: data['size']['id'] ? data['size']['id'] : null,
                name: data['size']['name'] ? data['size']['name'] : null,
            } : null,
            quantity: data['quantity'] ? data['quantity'] : null,
            price: data['price'] ? data['price'] : null
        } as CartItem;
    }
    static toRequest(addone) {
        const data = this.createFromResponse(addone);
        return Object.assign(data, {});
    }
}

