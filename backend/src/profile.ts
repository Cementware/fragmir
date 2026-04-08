import { Router, type Request, type Response } from 'express';
import { query } from './database.js';

const profileRouter = Router();

profileRouter.get('/list', async (req: Request, res: Response) => {
  try {
    return res.status(200).json(await query(`
    SELECT ID, username
    FROM user
    WHERE username LIKE LOWER(?)
      OR email LIKE LOWER(?)
    `, [
      '%' + req.query.q + '%',
      '%' + req.query.q + '%'
    ]));
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to search for users'
    });
  }
  console.log(req.query.q);
  return res.status(200).end();
});

export default profileRouter;
