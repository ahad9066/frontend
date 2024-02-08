export interface UserCart {
    userId: string;
    cartItems: CartItem[];
}

export interface CartItem {
    product: {
        id: string,
        name: string
    },
    subGrade: {
        id: string,
        name: string
    },
    size: {
        id: string,
        name: string
    }
    price: string;
    quantity: number;
}