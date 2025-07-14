import {ContextRunner} from "express-validator";
import {NextFunction} from "express";
import logger from "../../config/logger";
import {Request, Response} from "express";

export default function validate(validations: ContextRunner[]) {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        for (const validation of validations) {
            const result = await validation.run(req);
            if (!result.isEmpty()) {
                const text = result.array()[0].msg
                logger.error(`[Validation Error] ${JSON.stringify(result.array())}`);

                res.status(400).send(text);
                return;
            }
        }

        next();
    }
}