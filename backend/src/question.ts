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

questionRouter.post('/answer/:id', async (req: Request, res: Response) => {
  try {
    await query(`
    UPDATE question SET
    answer = ?,
    posted = ?
    WHERE ID = ?
    `, [
      req.body.answer,
      req.body.posted,
      req.params.id
    ]);
    return res.status(200).end();
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Could not answer question'
    })
  }
});

questionRouter.get('/list', async (req: Request, res: Response) => {
  try {
    return res.status(200).json(await query(`
    SELECT CASE WHEN (private = 1)
      THEN Null
      ELSE SENDER_ID end as sender_id,
      question,
      ID
    FROM question
    WHERE RECIPIENT_ID = ?`, [
      req.user.ID
    ]));
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Could not fetch questions'
    })
  }
});

export default questionRouter;
