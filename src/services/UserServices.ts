import { hashPassword } from "../utils/hash";
import User from "../models/User";
import jwt from "jsonwebtoken";
import { jwtsecret } from "../config/global";
import logger from "../config/logger";

export default class UserService {

    static async createUser(email, password) {
        logger.trace(`[UserService.createUser] Creating user [${email}]`);
        const hash = await hashPassword(password);
        return User.create({ email, hash });
    }

    static getByEmail(email) {
        logger.trace(`[UserService.getByEmail] Getting user [${email}]`);
        return User.findOne({where: {email}});

    }

    static tokenize(user: User) {
        logger.trace(`[UserService.tokenize] Tokenizing user [${user.id}]`);
        const payload = user.get({ plain: true }); 
        delete payload.hash;
        return jwt.sign(payload, jwtsecret);
    }
}