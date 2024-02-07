export interface UserDetails {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    countryCode: string;
    mobile: number;
    addresses: Address[];
    isMobileVerified: Boolean;
    isEmailVerified: Boolean;
}

export interface Address {
    _id: string;
    unitNumber: string;
    buildingNumber: string;
    streetName: string;
    city: string;
    province: string;
    postalCode: string;
    country: string;
    isDefault: Boolean;
}