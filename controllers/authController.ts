// controllers/authController.ts
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User, { IUser } from '../models/User';

const generateAccessToken = (user: { id: string; role: string }) => {
    return jwt.sign(user, process.env.JWT_SECRET as string, { expiresIn: '15m' });
};

const generateRefreshToken = (user: { id: string; role: string }) => {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET as string, { expiresIn: '7d' });
};

export const signUp = async (req: Request, res: Response) => {
    const { email, password, name, role } = req.body;
    const defaultRole = 'user';

    // Basic validation
    if (!email || !password) {
        return res.status(400).json({ msg: 'Please provide an email and password' });
    }

    if (role && !['admin', 'owner', 'manager', 'user'].includes(role)) {
        return res.status(400).json({ msg: 'Invalid role' });
    }

    try {
        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new User({
            email,
            password,
            name,
            role: role || defaultRole,
        });

        await user.save();

        const payload = {
            user: {
                id: user.id,
                role: user.role,
            },
        };

        const accessToken = generateAccessToken(payload.user);
        const refreshToken = generateRefreshToken(payload.user);

        res.json({ accessToken, refreshToken, userId: user.id, msg: 'User registered successfully' });
    } catch (err) {
        console.error((err as Error).message);
        res.status(500).send('Server error');
    }
};

export const logIn = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
        return res.status(400).json({ msg: 'Please provide an email and password' });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials - user not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials - password mismatch' });
        }

        const payload = {
            user: {
                id: user.id,
                role: user.role,
            },
        };

        const accessToken = generateAccessToken(payload.user);
        const refreshToken = generateRefreshToken(payload.user);

        res.json({ accessToken, refreshToken, userId: user.id, msg: 'User logged in successfully' });
    } catch (err) {
        console.error((err as Error).message);
        res.status(500).send('Server error');
    }
};

export const refreshAccessToken = (req: Request, res: Response) => {
    var accessQuery = req.query;

    var refreshToken = accessQuery["refresh-token"]

    console.log("logging...", refreshToken)

    if (!refreshToken) {
        return res.status(401).json({ msg: 'No refresh token provided' });
    }

    try {
        const { id, role } = jwt.verify(refreshToken as string, process.env.REFRESH_TOKEN_SECRET as string) as { id: string; role: string };
        const user = { id, role }
        console.warn("warning:", user)
        const newAccessToken = generateAccessToken(user);
        const newRefreshToken = generateRefreshToken(user);

        res.json({ accessToken: newAccessToken, refreshToken });
    } catch (err) {
        console.error((err as Error).message);
        res.status(403).json({ msg: 'Invalid refresh token' });
    }
};
