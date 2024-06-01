// middlewares/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

interface JwtPayload {
    user: {
        id: string;
        role: string;
    };
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
        (req as any).user! = await User.findById(decoded.user.id).select('-password');
        if (!(req as any).user!) {
            return res.status(401).json({ msg: 'User not found' });
        }
        next();
    } catch (err) {
        console.error((err as Error).message);
        res.status(401).json({ msg: 'Token is not valid' });
    }
};
