// routes/auth.ts
import express from 'express';
import { signUp, logIn, refreshAccessToken } from '../controllers/authController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/sign-up', signUp);
router.post('/log-in', logIn);
// router.put('/update-name', authMiddleware, updateName)
router.get('/refresh-token', refreshAccessToken)

export default router;
