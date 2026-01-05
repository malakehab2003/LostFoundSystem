import * as addressService from '../services/addressService.js';


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
            Address: addressData,
        });
    } catch (err) {
        return res.status(400).send({ err: err.message });
    }
}