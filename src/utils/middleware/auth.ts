import { Request } from 'express';
import { AuthUser, decodeToken } from '../decodeToken';
import logger from '../../config/logger';
import CustomError from "../CustomError";

interface AuthenticatedRequest extends Request {
    headers: {
        authorization?: string;
        [key: string]: any;
    };
    user: AuthUser;
    [key: string]: any;
}

export default async function auth(req: AuthenticatedRequest, res, next) {
    const token = req.get('authorization');
    if (!token) {
        throw new CustomError(403, 'User not authenticated');
    }

    const bearerToken = token.split('Bearer ')[1];
    if (!bearerToken) {
        throw new CustomError(403, 'User not authenticated: Token is not in correct format');
    }

    try {
        req.user = decodeToken(bearerToken);
        logger.info(`User [${req.user.id}] verified`);
        next();
    } catch (error) {
        logger.error(`Error decoding token: ${error.message}`);
        throw new CustomError(403, 'User not authenticated: Invalid token');
    }
}