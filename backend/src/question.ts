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
      req.body.response,
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
      SELECT 
          q.ID,
          q.question,
          q.created_at,
          CASE 
              WHEN q.private = 1 THEN NULL 
              ELSE u.username 
          END AS sender_username
      FROM question q
      LEFT JOIN user u ON q.SENDER_ID  = u.ID
      WHERE q.RECIPIENT_ID  = ?
        AND answer IS NULL`, [
      req.user.ID
    ]
    ));
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Could not fetch questions'
    })
  }
});

questionRouter.get('/notifications', async (req: Request, res: Response) => {
  try {
    const [row] = await query(`
    SELECT COUNT(*) AS count
    FROM question
    WHERE RECIPIENT_ID = ?
    AND answer IS NULL`,
      [req.user.ID]
    );
    return res.status(200).json({ count: Number(row.count) });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Could not fetch questions'
    })
  }
});

// fetches all public questions from a user
questionRouter.get('/posts/:id', async (req: Request, res: Response) => {
  try {
    return res.status(200).json(await query(`
    SELECT
      q.ID,
      q.question,
      q.answer,
      CASE 
        WHEN q.private = 1 THEN NULL 
        ELSE (SELECT username
                FROM user s
                WHERE s.ID = q.SENDER_ID)
      END AS sender_username,
      q.created_at
    FROM question q
    WHERE posted = 1
      AND RECIPIENT_ID = ?
    `, [
      req.params.id,
      req.params.id
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
