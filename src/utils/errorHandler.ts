import logger from "../config/logger";
import CustomError from "./CustomError";


export default function handleErrors(err, req, res, _) {
    logger.error(`[${req.method} @ ${req.path}] -> ${err.stack}`)

    // if ((req as any).shouldRedirect && (req as any).redirectTo) {
    //     const redirectUrl = new URL((req as any).redirectTo);
    //     redirectUrl.searchParams.set("error", err.message);
    //
    //     return res.redirect(redirectUrl.toString());
    // }

    if (err instanceof CustomError) {
        res.status(err.statusCode || 500).json({error: err.message || "Something broke!"})
    } else {
        res.status(500).json({error: err.message || 'Something broke!'})
    }
}