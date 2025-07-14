import logger from "../config/logger";
import CustomError from "./CustomError";

export default function handleErrors(err, req, res) {
    logger.error(`[${req.method} @ ${req.path}] -> ${err.stack}`)

    if (err instanceof CustomError) {
        res.status(err.statusCode || 500).send(err.message || "Something broke!")
    } else {
        res.status(500).send(err.msg || 'Something broke!')
    }
}