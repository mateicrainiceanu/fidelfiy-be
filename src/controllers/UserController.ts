import logger from "../config/logger";
import UserService from "../services/UserServices";
import { matchesHash } from "../utils/hash";
import CustomError from "../utils/CustomError";

class UserController {
    static async registerUser(email, password) {

        const existingUser = await UserService.getByEmail(email);

        if (existingUser) {
            throw new CustomError(400, "An user with this email already exists!");
        }

        if (!email || !password) {
            throw new CustomError(400, "An email or password must be provided!");
        }

        const user = await UserService.createUser(email, password);

        const token = UserService.tokenize(user);

        logger.debug(`[UserController.registerUser] User created [${user.id}]`);

        UserService.sanitize(user);

        return { user, token }
    }

    static async authenticateUser(email, password) {
        const user = await UserService.getByEmail(email);

        if (user === null) {
            throw Error("No user with this email was found!");
        }

        if (!await matchesHash(password, user.hash)){
            throw Error("Passwords do not match!");
        }

        UserService.sanitize(user);

        const token = UserService.tokenize(user);

        logger.debug(`[UserController.authenticateUser] authenticated user with id [${user.id}]`);

        return { user, token }
    }
    
    static async getUser(id: string) {
        const user = await UserService.getById(id);
        if (user === null) {
            throw new CustomError(404, "No user with this id was found!");
        }
        UserService.sanitize(user);
        return user;
    }

    static async updateUser(id: string, data: object) {
        logger.debug(`UserController.updateUser => ${id}`);
        const user = await UserService.getById(id);

        if (!user) {
            throw new CustomError(404, "No user with this id was found!");
        }

        const updatedUser = await UserService.updateUser(id, data);

        const token = UserService.tokenize(updatedUser);

        return {token, user: updatedUser};
    }
}

export default UserController;