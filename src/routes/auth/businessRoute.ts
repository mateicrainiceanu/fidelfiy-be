import express from "express";
import auth from "../../utils/middleware/auth";
import validate from "../../utils/middleware/validate";
import {body, param} from "express-validator";
import BusinessController from "../../controllers/BusinessController";

const router = express.Router();

router.get("/businesses",
    async (req, res) => {
        res.status(200).send([]);
    });

router.get("/business/:identifier",
    auth,
    validate([
        param('identifier').isString().isLength({min: 3})
    ]),
    async (req, res) => {

    const business  = await BusinessController.getBusiness(req.params.identifier, req.user.id);

    res.status(200).send(business);
});

router.post("/business", auth,
    validate([
        body('name').isString().isLength({min: 3}),
        body('identifier').isString().isLength({min: 3}),
    ]),
    async (req, res) => {

        const businessDetails = req.body;

        const business = await BusinessController.createBusiness(req.user.id, businessDetails)

        res.status(200).send(business);
    });

router.put("/business/:identifier", auth,
    async (req, res) => {
        throw new Error("Not implemented");
    }
);

router.delete("/business/:identifier", auth,
    async (req, res) => {

        throw new Error("Not implemented");
    }
);


export default router;