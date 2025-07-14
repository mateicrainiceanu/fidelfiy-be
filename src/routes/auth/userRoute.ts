import express from "express";
import auth from "../../utils/middleware/auth";

const router = express.Router();

router.get("/user", auth, (req, res) => {
    res.json(req.user)
})

export default router;