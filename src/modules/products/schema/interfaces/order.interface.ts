import { CartItem } from "./cart.interface"

export interface Order {
    orderId: string,
    userId: string,
    firstName: string,
    lastName: string,
    address: Address,
    orderItems: CartItem[]
    totalAmount: number,
    status: string,
    invoiceFileKey: string,
    isInvoiceGenerated: boolean,
    createdAt: string
}

export interface Address {
    _id: string,
    unitNumber: string,
    buildingNumber: string,
    streetName: string,
    city: string,
    province: string,
    postalCode: string,
    country: string,
    isDefault: boolean
}