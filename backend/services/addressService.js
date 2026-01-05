import { Address } from '../models/db.js';


export const createAddressService = async(addressData) => {
    if (!addressData) throw ("Missing data");

    const newAddress = await Address.create ({
        name: addressData.name,
        address: addressData.address,
        city: addressData.city,
        state: addressData.state,
        country: addressData.country,
        postal_code: addressData.postal_code,
        user_id: addressData.user_id,
    });

    return newAddress;
}


export const listAddressService = async (user_id) => {
    if (!user_id) throw ("Missing user");

    const addresses = await Address.findAll({
      where: { user_id },
      order: [["created_at", "DESC"]],
    });

    return addresses;
}


export const updateAddressService = async (addressData) => {
    if (!addressData) throw ("Missing data");

    const address = await Address.findOne({
        where: {id: addressData.address_id},
    });

    if (address.user_id !== addressData.user_id) throw ("User can't update this address");

    const fieldToUpdate = ['name', 'address', 'city', 'state', 'country', 'postal_code'];

    fieldToUpdate.forEach((field) => {
        if(addressData[field]) {
            address[field] = addressData[field];
        }
    });

    await address.save();

    return address;
}