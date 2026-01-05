import * as addressService from '../services/addressService.js';
import * as cleanData from '../utils/cleanData.js';


export const createAddress = async(req, res) => {
    try {
        const user = req.user;
        const { name, address, city, state, country, postal_code } = req.body;
    
        if (!name, !address, !city, !country, !user, !state, !postal_code) return res.status(400).send({err: "Missing requried values"});

        const addressData = {
            name,
            address,
            city,
            country,
            user,
            state,
            postal_code,
        };

        await addressService.createAddressService(addressData);

        return res.status(201).send({
            message: "Address added successfully",
            Address: cleanData.cleanAddresses(addressData),
        });
    } catch (err) {
        return res.status(400).send({ err: err.message });
    }
}


export const listAddresses = async (req, res) => {
    try {
        const user = req.user;
    
        if (!user) return res.status(400).send({err: "Missing user"});

        const Addresses = await addressService.listAddressService(user.id);

        return res.status(200).send ({
            addresses: cleanData.cleanAddresses(Addresses),
        });
    } catch (err) {
        return res.status(400).send({ err: err.message });
    }

}