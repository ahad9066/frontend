import { Address, Order } from "../interfaces/order.interface";
import { CartItemsHelper } from "./cart.model";

export class OrderHelper {
    static createFromResponse(data: {}) {
        return {
            orderId: data['orderId'] ? data['orderId'] : null,
            userId: data['userId'] ? data['userId'] : null,
            firstName: data['firstName'] ? data['firstName'] : null,
            lastName: data['lastName'] ? data['lastName'] : null,
            address: data['address'] ? AddressHelper.createFromResponse(data['address']) : null,
            orderItems: data['orderItems'] ? [...data['orderItems'].map((item: any) => CartItemsHelper.createFromResponse(item))] : [],
            totalAmount: data['totalAmount'] ? data['totalAmount'] : null,
            status: data['totalAmostatusunt'] ? data['status'] : null,
            invoiceFileKey: data['invoiceFileKey'] ? data['invoiceFileKey'] : null,
            isInvoiceGenerated: data['isInvoiceGenerated'] ? data['isInvoiceGenerated'] : false,
            createdAt: data['createdAt'] ? data['createdAt'] : false,
        } as Order;
    }
    static toRequest(addone) {
        const data = this.createFromResponse(addone);
        return Object.assign(data, {});
    }
}

export class AddressHelper {
    static createFromResponse(data: {}) {
        return {
            _id: data['_id'] ? data['_id'] : null,
            unitNumber: data['unitNumber'] ? data['unitNumber'] : null,
            buildingNumber: data['buildingNumber'] ? data['buildingNumber'] : null,
            streetName: data['streetName'] ? data['streetName'] : null,
            city: data['city'] ? data['city'] : null,
            province: data['province'] ? data['province'] : null,
            postalCode: data['postalCode'] ? data['postalCode'] : null,
            country: data['country'] ? data['country'] : null,
            isDefault: data['isDefault'] ? data['isDefault'] : false,

        } as Address;
    }
    static toRequest(addone) {
        const data = this.createFromResponse(addone);
        return Object.assign(data, {});
    }
}

