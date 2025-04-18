import jwt from 'jsonwebtoken';
import { jwtsecret } from '../config/global';

export interface AuthUser {
    id: string;
    email: string;
}

export function decodeToken(token: string): AuthUser {

    const decoded = jwt.verify(token, jwtsecret) as AuthUser;

    if (!decoded) {
        throw new Error('Invalid token: Request us unauthorized');
    }
    
    return decoded;
}