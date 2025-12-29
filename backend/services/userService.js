import { User } from '../models/db.js';
import * as jwt from '../utils/jwt.js';
import * as hash from '../utils/hash.js';
import * as auth from '../utils/auth.js';
import redisClient from '../utils/redisClient.js';


export const createUserService  = async (userData) => {
    try {
        const existUser = await auth.getUserByEmail(userData.email);
    
        if (existUser) {
            throw Error('Email already exists');
        }

        const hashedPassword = await hash.hashPassword(userData.password);

        userData.password = hashedPassword;
        
        const user = await User.create({
            ...userData,
            last_login: new Date(),
            role: 'user',
        });

        const token = jwt.createToken(userData.email);

        return {
            token,
            user
        };
    } catch (err) {
        throw (err)
    }
}


export const loginService = async (email, password) => {
    const user = await auth.getUserByEmail(email);

    if (!user || user.is_deleted) {
        throw ({ message: "User not found" });
    }

    const isMatch = await hash.checkPassword(password, user.password);

    if (!isMatch) {
        throw ('Incorrect password');
    }

    user.last_login = new Date();
    await user.save()
    
    const token = jwt.createToken(email);

    return {
        token,
        user,
    };
}


export const updateUserService = async (user, data) => {
    if (!user) {
        throw ("No user");
    }

    const fieldToUpdate = ['name', 'phone', 'image_url', 'dob'];

    fieldToUpdate.forEach((field) => {
        if(data[field]) {
            user[field] = data[field];
        }
    });

    await user.save();

    return user;
}


export const deleteUserService = async (user, authorization) => {
    if (!user || !auth) throw ("No user or auth");

    const token = auth.getTokenFromAuth(authorization);
    const duration = 7 * 24 * 60 * 60;
    redisClient.set(`blacklist_${token}`, 'true', duration);

    user.is_deleted = true;
    await user.save();
}


export const undoDeleteService = async (email, password) => {
    const user = await auth.getUserByEmail(email);
    
    if (!user) throw ('no User');

    const isMatch = await hash.checkPassword(password, user.password);
    if (!isMatch) throw ('Wrong password');


    user.is_deleted = false;
    await user.save()
    const token = jwt.createToken(email);

    return {
        token,
        user,
    }
}


export const logOutService = async (authorization) => {

    const token = auth.getTokenFromAuth(authorization);
    const duration = 7 * 24 * 60 * 60;
    redisClient.set(`blacklist_${token}`, 'true', duration);
}


export const changePasswordUserService = async (user, oldPassword, newPassword) => {
    const isMatch = await hash.checkPassword(oldPassword, user.password);
    if (!isMatch) throw ('Password not match');

    const hashedPassword = await hash.hashPassword(newPassword);

    user.password = hashedPassword
    await user.save();
}
