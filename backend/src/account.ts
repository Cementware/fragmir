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

    const [user]: any = await query(`
    SELECT ID
    FROM user
    WHERE email = ? AND username = ?
    `, [
      req.body.email,
      req.body.username,
    ]);

    const token = jwt.sign(
      { ID: user.ID, email: req.body.email, username: req.body.username },
      process.env.JWT_SECRET as string,
      { expiresIn: '24h' }
    );

    return res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      path: '/',
      maxAge: 86400000
    }).status(200).end();
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to register user. Try a different username'
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
      { ID: user.ID, email: user.email, username: user.username },
      process.env.JWT_SECRET as string,
      { expiresIn: '24h' }
    );

    return res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
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
    sameSite: 'lax',
    maxAge: 86400000
  });
  return res.status(200).end();
});

accountRouter.get('/me', protect, async (req: Request, res: Response) => {
  if (!(await query(`SELECT 1 FROM user WHERE ID = ?`, [req.user.ID]) as any[]).length)
    return res.status(401).json({});
  const [user]: any[] = await query(`SELECT ID, username, points FROM user WHERE ID = ?`, [req.user.ID]);
  return res.status(200).json(user);
});

export default accountRouter;
