import { Router, type Request, type Response } from 'express';
import { query } from './database.js';

const profileRouter = Router();

profileRouter.get('/list', async (req: Request, res: Response) => {
  try {
    console.log(req.user)
    return res.status(200).json(await query(`
    SELECT ID, username
    FROM user
    WHERE (username LIKE LOWER(?)
      OR email LIKE LOWER(?))
      AND ID <> ?
    `, [
      '%' + req.query.q + '%',
      '%' + req.query.q + '%',
      req.user.ID
    ]));
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to search for users'
    });
  }
  return res.status(200).end();
});

profileRouter.get('/by-id/:id', async (req: Request, res: Response) => {
  try {
    const [user]: { username: string } = await query(`
    SELECT username
    FROM user
    WHERE ID = ?`, [
      req.params.id
    ]);
    return res.status(200).json(user);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to find user'
    });
  }
  return res.status(200).end();
});

export default profileRouter;
