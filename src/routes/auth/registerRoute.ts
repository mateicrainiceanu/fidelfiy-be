import express from "express";
import UserController from "../../controllers/UserController";
import validate from "../../utils/middleware/validate";
import {body} from "express-validator";

const router = express.Router()

router.post("/register",
    validate([
        body('email').isEmail(),
        body('password').isString().isLength({min: 8})
    ]),
    async (req, res) => {
    const { email, password }: { email?: string, password?: string} = req.body || {};

    const {user, token} = await UserController.registerUser(email, password);

    res.status(201).json({user, token});
})

export default router;