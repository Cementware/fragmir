import { Router, type Request, type Response } from 'express';
import { query } from './database.js';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { protect } from './auth.js';

const accountRouter = Router();

accountRouter.post('/register', async (req: Request, res: Response) => {
  try {
    await query(`
    INSERT INTO user (
      username,
      password,
      email
    ) VALUES (?, ?, ?)
    `, [
      req.body.username,
      await argon2.hash(req.body.password, { type: argon2.argon2id }),
      req.body.email
    ]);
    return res.status(200).end();
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to register user'
    })
  }
});

accountRouter.post('/login', async (req: Request, res: Response) => {
  try {
    const [user]: any = await query(`
    SELECT *
    FROM user
    WHERE email = ? OR
      username = ?
    `, [
      req.body.identifier,
      req.body.identifier
    ]);
    if (!user) return res.status(401).json({ message: 'Invalid email or username' });

    if (!await argon2.verify(user.password, req.body.password)) return res.status(401).json({ message: 'Invalid password' });

    const token = jwt.sign(
      { userID: user.ID, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: '24h' }
    );

    return res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/',
      maxAge: 86400000
    }).status(200).end();
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to register user'
    })
  }
});

accountRouter.post('/logout', protect, (_, res: Response) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/',
    maxAge: 86400000
  });
  return res.status(200).end();
});

export default accountRouter;
