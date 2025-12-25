import * as userAuth from './auth.js';
import redis from './redisClient.js';

export const AuthRequest = async (req, res, next) => {
    try {
        const auth = req.get('Authorization');

        if (!auth) return res.status(401).send({error: "Unauthorized"});


        const token = userAuth.getTokenFromAuth(auth);
        if (!token || await redis.get(`blacklist_${token}`)) {
            return res.status(401).send({error: "Unauthorized"});
        }

        req.user = await userAuth.getUserFromToken(token);
        next()
    } catch (err) {
        return res.status(401).send({error: "Unauthorized"});
    }
}
