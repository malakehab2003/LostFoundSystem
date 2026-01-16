import * as userAuth from './auth.js';
import redis from './redisClient.js';

export const AuthRequest = async (req, res, next) => {
    try {
        const auth = req.get('Authorization');

        if (!auth) return res.status(401).send({error: "Unauthorized"});


        const token = userAuth.getTokenFromAuth(auth);
        if (!token || await redis.get(`blacklist_${token}`)) {
            return res.status(401).send({error: "Token blacklisted"});
        }

        const user = await userAuth.getUserFromToken(token);
        
        
        if (user.is_deleted) {
            return res.status(401).send({error: "User deleted"});
        }

        req.user = user;
        next()
    } catch (err) {
        return res.status(401).send({error: "Unauthorized"});
    }
}


export const userAuth = (req, res, next) => {
    const user = req.user;

    if (!user) return res.status(401).send({error: "Unauthorized"});

    if (user.role !== 'user') return res.status(401).send({error: "Unauthorized"});

    next();
}


export const staffAuth = (req, res, next) => {
    const user = req.user;

    if (!user) return res.status(401).send({error: "Unauthorized"});

    if (user.role !== 'staff') return res.status(401).send({error: "Unauthorized"});

    next();
}


export const ownerAuth = (req, res, next) => {
    const user = req.user;

    if (!user) return res.status(401).send({error: "Unauthorized"});

    if (user.role !== 'owner') return res.status(401).send({error: "Unauthorized"});

    next();
}


export const managerAuth = (req, res, next) => {
    const user = req.user;

    if (!user) return res.status(401).send({error: "Unauthorized"});

    if (user.role !== 'manager') return res.status(401).send({error: "Unauthorized"});

    next();
}
