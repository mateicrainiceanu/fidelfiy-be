import {hashPassword} from "../utils/hash";
import jwt from "jsonwebtoken";
import {jwtsecret} from "../config/global";
import logger from "../config/logger";
import prisma from "../config/db";
import {User} from "@prisma/client";
import CustomError from "../utils/CustomError";

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

    static getById(id: string) {
        logger.trace(`[UserService.getById] Getting user [${id}]`);
        return prisma.user.findUnique({where: {id}});
    }

    static tokenize(user: User) {
        logger.trace(`[UserService.tokenize] Tokenizing user [${user.id}]`);
        const payload = {id: user.id, email: user.email};
        return jwt.sign(payload, jwtsecret);
    }

    static sanitize(user: User) {
        logger.trace(`[UserService.sanitize] Sanitizing user [${user.id}]`);
        delete user.hash;
    }

    static async updateUser(id: string, data: any) {
        logger.trace(`[UserService.updateUser] Updating user [${id}] [${data}]`);

        delete data.hash
        delete data.id
        delete data.createdAt
        delete data.updatedAt

        if (!data.fname) data.fname = null
        if (!data.lname) data.lname = null
        if (!data.phone) data.phone = null
        if (!data.bdate) data.bdate = null

        if (data.bdate) {
            const date = new Date(data.bdate);
            try {
                data.bdate = date.toISOString();
            } catch (_) {
                throw new CustomError(400, "Invalid date format");
            }
        }

        const updatedUser: User = await prisma.user.update({where: {id}, data});

        UserService.sanitize(updatedUser);

        return updatedUser;
    }
}