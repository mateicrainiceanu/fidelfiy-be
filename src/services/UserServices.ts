import {hashPassword} from "../utils/hash";
import jwt from "jsonwebtoken";
import {jwtsecret} from "../config/global";
import logger from "../config/logger";
import prisma from "../config/db";
import {User} from "@prisma/client";

export default class UserService {
    static async createUser(email: string, password: string) {
        logger.trace(`[UserService.createUser] Creating user [${email}]`);

        const hash = await hashPassword(password);

        return prisma.user.create({
            data: {
                email,
                hash,
                fname: null,
                lname: null,
                phone: null,
                bdate: null

            },
        });
    }

    static getByEmail(email: string) {
        logger.trace(`[UserService.getByEmail] Getting user [${email}]`);
        return prisma.user.findUnique({where: {email}});
    }

    static tokenize(user: User) {
        logger.trace(`[UserService.tokenize] Tokenizing user [${user.id}]`);
        const payload = {id: user.id, email: user.email};
        return jwt.sign(payload, jwtsecret);
    }
}