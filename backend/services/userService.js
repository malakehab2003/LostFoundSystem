import { User } from '../models/db.js';
import * as jwt from '../utils/jwt.js';
import * as hash from '../utils/hash.js';
import * as auth from '../utils/auth.js';


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

    if (!user) {
        throw ({ message: "User not found" });
    }

    const isMatch = await hash.checkPassword(password, user.password);

    if (!isMatch) {
        throw ('Incorrect password');
    }

    const token = jwt.createToken(email);

    return {
        token,
        user,
    };
}


export const updateUserService = async (user, data) => {
    if (!user) {
        throw new Error("No user");
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
