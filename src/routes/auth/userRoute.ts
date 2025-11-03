import express from "express";
import auth from "../../utils/middleware/auth";
import UserController from "../../controllers/UserController";
import validate from "../../utils/middleware/validate";
import {body} from "express-validator";

const router = express.Router();

router.get("/user", auth, (req, res) => {
    res.json(req.user)
})

router.get("/user-data", auth, async (req, res) => {
    const user = await UserController.getUser(req.user.id);
    res.json(user);
})

router.put("/user", auth,
    validate([
        body('email').isEmail(),
    ]),
    async (req, res) => {
        const putBody = req.body;

        const {user, token} = await UserController.updateUser(req.user.id, putBody);

        res.status(200).json({user, token});



})

export default router;