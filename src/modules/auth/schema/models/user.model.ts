import { UserDetails } from "../interfaces/user.interface";
import { AddressHelper } from "./address.model";


export class UserDetailsHelper {
    static createFromResponse(data: {}) {
        return {
            _id: data['_id'] ? data['_id'] : null,
            firstName: data['firstName'] ? data['firstName'] : null,
            lastName: data['lastName'] ? data['lastName'] : null,
            email: data['email'] ? data['email'] : null,
            countryCode: data['countryCode'] ? data['countryCode'] : null,
            mobile: data['mobile'] ? data['mobile'] : null,
            isMobileVerified: data['isMobileVerified'] ? data['isMobileVerified'] : false,
            isEmailVerified: data['isEmailVerified'] ? data['isEmailVerified'] : false,
            addresses: data['addresses'] ? [...data['addresses'].map((address: any) => AddressHelper.createFromResponse(address))] : []
        } as UserDetails;
    }
    static toRequest(addone) {
        const data = this.createFromResponse(addone);
        return Object.assign(data, {});
    }
}
