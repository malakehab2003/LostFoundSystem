import * as validate from '../utils/validateData.js';
import cleanUser from '../utils/cleanUser.js';
import * as userService from '../services/userService.js'


export const createUser = async(req, res) => {
    try {
        const { name, age, gender, phone, email, password, image_url } = req.body;
        const userData = { name, age, gender, phone, email, password, image_url };

        validate.validateUserData(userData);

        const { token, user } = await userService.createUserService(userData);

        return res.status(201).send({
            message: "User created successfully",
            token,
            user: cleanUser(user),
        });
    } catch (err) {
        return res.status(400).send({ error: err.message })
    }
}