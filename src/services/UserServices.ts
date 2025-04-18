import { hashPassword } from "../utils/hash";
import User from "../models/User";
import jwt from "jsonwebtoken";
import { jwtsecret } from "../config/global";

export default class UserService {

    static async createUser(email, password) {
        const hash = await hashPassword(password);
        return User.create({ email, hash });
    }

    static getByEmail(email) {
        return User.findOne({where: {email}});

    }

    static tokenize(user: User) {
        const payload = user.get({ plain: true }); 
        delete payload.hash;
        return jwt.sign(payload, jwtsecret);
    }
}