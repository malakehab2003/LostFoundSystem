import { Address, User, Government, City } from '../models/db.js';
import * as addressUtils from '../utils/address.js';


export const createAddressService = async(addressData) => {
    if (!addressData) throw ("Missing data");

    const newAddress = await Address.create ({
        name: addressData.name,
        address: addressData.address,
        city_id: addressData.city_id,
        government_id: addressData.government_id,
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
      include: [
        {
            model: User,
            as: 'user',
            attributes: ['id', 'name']
        },
        {
            model: Government,
            as: 'government',
            attributes: ['id', 'name_en']
        },
        {
            model: City,
            as: 'city',
            attributes: ['id', 'name_en']
        }
      ]
    });

    return addresses;
}


export const updateAddressService = async (addressData) => {
    if (!addressData) throw ("Missing data");

    const address = await addressUtils.getAddress(addressData.address_id);

    if (!addressUtils.checkAddressForUser(address, addressData.user_id)) throw ("User can't update this address");
    
    const fieldToUpdate = ['name', 'address', 'city_id', 'government_id', 'postal_code'];
    
    fieldToUpdate.forEach((field) => {
        if(addressData[field]) {
            address[field] = addressData[field];
        }
    });
    
    await address.save();
    
    return address;
}


export const deleteAddressService = async (user_id, address_id) => {
    if (!user_id || !address_id) throw ("Missing data");
    
    const address = await addressUtils.getAddress(address_id);
    
    if (!addressUtils.checkAddressForUser(address, user_id)) throw ("User can't update this address");

    await address.destroy();
}


export const validateAddressToUser = async (user_id, address_id) => {
    if (!user_id || !address_id) throw new Error ("Missing address id or user id");

    const address = await Address.findByPk(address_id);
    if (!address || address.user_id !== user_id) throw new Error ("User don't have this address");
}
