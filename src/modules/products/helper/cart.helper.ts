import { CartItem } from "../schema/interfaces/cart.interface";

export const cartHelper = (cartItems: CartItem[], newCartItem: CartItem) => {
    console.log("oldcart", cartItems)
    console.log("newCartItem", newCartItem)
    let flag = 0;
    const items = JSON.parse(JSON.stringify(cartItems));
    items.forEach(item => {
        if (item.size.id == newCartItem.size.id && item.subGrade.id == newCartItem.subGrade.id) {
            item.quantity = item.quantity + newCartItem.quantity;
            // item = { ...item, quantity: item.quantity + newCartItem.quantity };

            flag = 1;
        }
    });
    if (flag == 0) {
        items.push(newCartItem);
    }
    console.log("item", items)
    return items;
}