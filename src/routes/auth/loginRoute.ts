import express from "express";
import UserController from "../../controllers/UserController";
import logger from "../../config/logger";
import validate from "../../utils/middleware/validate";
import {body} from "express-validator";

const router = express.Router()

router.post("/login",
    validate([
        body('email').isEmail(),
        body('password').isString()
    ]),
    async (req, res) => {
    const {email, password}: { email?: string, password?: string } = req.body || {};

    if (!email || !password) {
        res.status(400).send("A username or password must be provided");
        return;
    }

    const {user, token} = await UserController.authenticateUser(email, password);
    logger.info(`User [${user.id}] authenticated`);
    res.status(200).json({user, token});

})

export default router;