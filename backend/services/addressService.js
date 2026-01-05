import { Address } from '../models/db.js';


export const createAddressService = async(addressData) => {
    if (!addressData) throw ("Missing data");

    await Address.create ({
        name: addressData.name,
        address: addressData.address,
        city: addressData.city,
        state: addressData.state,
        country: addressData.country,
        postal_code: addressData.postal_code,
        user_id: addressData.user.id,
    });
}