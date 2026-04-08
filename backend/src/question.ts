import { Router, type Request, type Response } from 'express';
import { query } from './database.js';

const questionRouter = Router();

questionRouter.post('/post/:id', async (req: Request, res: Response) => {
  try {
    await query(`
    INSERT INTO question (
      SENDER_ID,
      RECIPIENT_ID,
      question,
      private
    ) VALUES (?, ?, ?, ?)
    `, [
      req.user.ID,
      req.params.id,
      req.body.question,
      req.body.private
    ]);
    return res.status(200).end();
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Could not post new question'
    })
  }
});

export default questionRouter;
