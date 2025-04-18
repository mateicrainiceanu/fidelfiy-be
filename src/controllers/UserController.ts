import logger from "../config/logger";
import UserService from "../services/UserServices";
import { matchesHash } from "../utils/hash";

class UserController {
    static async registerUser(email, password) {
        const user = await UserService.createUser(email, password);

        const token = await UserService.tokenize(user);

        logger.info(`User created [${user.id}]`);

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

        delete user.hash;
        
        const token = UserService.tokenize(user);

        return { user, token }
    }

}

export default UserController;