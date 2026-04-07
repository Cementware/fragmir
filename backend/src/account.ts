import { Router, type Request, type Response } from 'express';
import { query } from './database.js';
import argon2 from 'argon2';

const accountRouter = Router();

// Middleware with explicit TypeScript types
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

export default accountRouter;
