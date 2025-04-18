import express from "express";
import UserController from "../../controllers/UserController";
import logger from "../../config/logger";

const router = express.Router()

router.post("/login", async (req, res) => {
    const { email, password }: { email?: string, password?: string } = req.body || {};

    if (!email || !password) {
        res.status(400).send("A username or password must be provided");
        return;
    }

    try {
        const {user, token} = await UserController.authenticateUser(email, password);
        logger.info(`User [${user.id}] authenticated`);
        res.status(200).json({user, token});
    } catch (error) {
        logger.error(`Error authenticating user [${email}]: ${error.message}`);
        res.status(400).send("Invalid credentials");
    }

})

export default router;