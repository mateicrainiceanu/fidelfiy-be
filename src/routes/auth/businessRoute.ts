import express from "express";
import auth from "../../utils/middleware/auth";
import validate from "../../utils/middleware/validate";
import {body, param, query} from "express-validator";
import BusinessController from "../../controllers/BusinessController";
import UserController from "../../controllers/UserController";

const router = express.Router();

router.get("/businesses",
    auth,
    validate([
        query('for').isString().isIn(['admin', 'user'])
    ]),
    async (req, res) => {

        const businesses = await BusinessController.getBusinessFor(req.user.id, req.query.for);
        res.status(200).send({businesses});
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

router.put("/business/:identifier",
    validate([
        param('identifier').isString().isLength({min: 3}),
        body('name').isString().isLength({min: 3}),
        body('identifier').isString().isLength({min: 3})
    ]),
    auth,
    async (req, res) => {
        const updatedBusiness = await BusinessController.updateBusinessData(req.params.identifier, req.body, req.user.id);

        res.status(200).send(updatedBusiness);
    }
);

router.delete("/business/:identifier",
    validate([
        param('identifier').isString().isLength({min: 3})
    ]),
    auth,
    async (req, res) => {
        const response = await BusinessController.deleteBusiness(req.params.identifier, req.user.id);

        res.status(204).send(response);
    }
);


export default router;