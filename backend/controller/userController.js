import * as validate from '../utils/validateData.js';
import * as cleanData from '../utils/cleanData.js';
import * as userService from '../services/userService.js'


export const createUser = async (req, res) => {
    try {
        const { name, dob, gender, phone, email, password, image_url } = req.body;
        const userData = { name, dob, gender, phone, email, password, image_url };

        validate.validateUserData(userData);

        const { token, user } = await userService.createUserService(userData);

        return res.status(201).send({
            message: "User created successfully",
            token,
            user: cleanData.cleanUser(user),
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

        return res.status(200).send(cleanData.cleanUser(req.user));
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
            user: cleanData.cleanUser(user)
        });
    } catch (err) {
        return res.status(400).send({ error: err.message })
    }
}


export const update = async (req, res) => {
    try {
        const user = req.user;
        const { name, phone, dob, image_url } = req.body;

        if (name) validate.validateName(name);
        if (phone) validate.validatePhone(phone);
        if (dob) validate.validateDob(dob);
        if (image_url) validate.validateImageUrl(image_url);

        const updatedUser = await userService.updateUserService(user, { name, phone, dob, image_url });

        return res.status(200).send({
            message: "User updated successfully",
            user: cleanData.cleanUser(updatedUser),
        });
    } catch (err) {
        return res.status(400).send({ error: err.message })
    }
}


export const deleteUser = async (req, res) => {
    try {
        const user = req.user;
        const auth = req.get('Authorization');

        await userService.deleteUserService(user, auth);

        return res.status(200).send({
            message: 'User deleted successfully',
        });
    } catch (err) {
        return res.status(400).send({ error: err.message })
    }
}


export const undoDelete = async (req, res) => {
    try {
        const { email, password } = req.body
        validate.validateEmail(email);
        validate.validatePassword(password);

        const { user, token } = await userService.undoDeleteService(email, password);

        return res.status(200).send({
            message: "User undone successfully",
            user: cleanData.cleanUser(user),
            token,
        });
    } catch (err) {
        return res.status(400).send({ error: err.message })
    }

}


export const logOut = async (req, res) => {
    try {
        const auth = req.get('Authorization');

        await userService.logOutService(auth);

        return res.status(200).send({
            message: 'Logged out successfully',
        });
    } catch (err) {
        return res.status(400).send({ error: err.message })
    }
}


export const chagePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body
        const user = req.user;

        if (!oldPassword || !newPassword || !user) {
            return res.status(400).send({message: 'Missing data'});
        }

        validate.validatePassword(newPassword);

        await userService.changePasswordUserService(user, oldPassword, newPassword);

        return res.status(200).send({
            message: 'User password changed successfully',
        });
    } catch (err) {
        return res.status(400).send({ error: err.message })
    }
}


export const getAnotherUser = async (req, res) => {
    try {
        const { id, email } = req.query;
        
        if (!email && !id) return res.status(400).send({message: 'Missing email and id'});

        const user = await userService.getAnotherUserService(email, id);

        if (!user) return res.status(400).send({message: "Can't get user"});

        return res.status(200).send({
            user: cleanData.cleanUser(user),
        });
    } catch (err) {
        return res.status(400).send({ error: err.message })
    }
}
