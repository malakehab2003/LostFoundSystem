import * as validate from '../utils/validateData.js';
import cleanUser from '../utils/cleanUser.js';
import * as userService from '../services/userService.js'


export const createUser = async (req, res) => {
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


export const getMe = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(400).send({ error: "No user" });
        }

        return res.status(200).send(cleanUser(req.user));
    } catch (err) {
        return res.status(400).send({ error: err.message })
    }
}


export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        validate.validateEmail(email);
        validate.validatePassword(password);

        const { token, user } = await userService.loginService(email, password);

        return res.status(200).send({
            message: "login successfully",
            token,
            user: cleanUser(user)
        });
    } catch (err) {
        return res.status(400).send({ error: err.message })
    }
}


export const update = async (req, res) => {
    
}
