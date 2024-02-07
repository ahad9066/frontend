import { Address } from '../interfaces/user.interface';

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
            isDefault: data['isDefault'] ? data['isDefault'] : false
        } as Address;
    }
    static toRequest(addone) {
        const data = this.createFromResponse(addone);
        return Object.assign(data, {});
    }
}
