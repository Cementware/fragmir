import { Router, type Request, type Response } from 'express';
import { query } from './database.js';

const locationRouter = Router();
const eventRouter = Router({ mergeParams: true });
locationRouter.use('/:location_id/', eventRouter)

locationRouter.get('/list', async (req: Request, res: Response) => {
  try {
    if (req.query.q)
      return res.status(200).json(await query(`
      SELECT
        l.ID,
        l.name,
        l.location,
        (SELECT COUNT(*)
          FROM event e
          WHERE e.LOCATION_ID = l.ID) AS count
      FROM location l
      WHERE (name LIKE LOWER(?)
      OR location LIKE LOWER(?))`, [
        '%' + req.query.q + '%',
        '%' + req.query.q + '%',
      ]));
    else
      return res.status(200).json(await query(`
      SELECT
        l.ID,
        l.name,
        l.location,
        (SELECT COUNT(*)
        FROM event e
        WHERE e.LOCATION_ID = l.ID) AS count
      FROM location l
      ORDER BY name
      LIMIT 50`,
      ));
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to search for location'
    });
  }
});

locationRouter.get('/info/:location_id', async (req: Request, res: Response) => {
  try {
    return res.status(200).json((await query(`
    SELECT
      name,
      location
    FROM location
    WHERE ID = ?
    `, [req.params.location_id]) as any)[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to search for location'
    });
  }
})

eventRouter.get('/list', async (req: Request, res: Response) => {
  try {
    if (req.query.q)
      return res.status(200).json(await query(`
      SELECT
        ID,
        name,
        description,
        time,
        end_time,
        CASE 
          WHEN e.private = 1 THEN NULL 
          ELSE (SELECT username FROM user u WHERE  u.ID = e.CREATOR_ID)
        END AS creator_username,
        (SELECT COUNT(*) FROM participant p WHERE p.EVENT_ID = e.ID) as participants,
        EXISTS (SELECT 1 FROM participant p WHERE p.EVENT_ID = e.ID AND p.USER_ID = ?) AS participating
      FROM event e
      WHERE (name LIKE LOWER(?)
      OR description LIKE LOWER(?))
      AND LOCATION_ID = ?
      ORDER BY time, end_time, name`, [
        '%' + req.query.q + '%',
        '%' + req.query.q + '%',
        req.user.ID,
        req.params.location_id,
      ]));
    else
      return res.status(200).json(await query(`
      SELECT
        ID,
        name,
        description,
        time,
        end_time,
        CASE 
          WHEN e.private = 1 THEN NULL
          ELSE (SELECT username FROM user u WHERE  u.ID = e.CREATOR_ID)
        END AS creator_username,
        (SELECT COUNT(*) FROM participant p WHERE p.EVENT_ID = e.ID) as participants,
        EXISTS (SELECT 1 FROM participant p WHERE p.EVENT_ID = e.ID AND p.USER_ID = ?) AS participating
      FROM event e
      WHERE LOCATION_ID = ?
        AND (end_time > NOW() OR end_time IS NULL)
      ORDER BY time, end_time, name
      LIMIT 50`, [
        req.user.ID,
        req.params.location_id,
      ]));
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to search for location'
    });
  }
});

eventRouter.post('/post', async (req: Request, res: Response) => {
  try {
    await query(`
    INSERT INTO event (
      name,
      time,
      end_time,
      description,
      private,
      CREATOR_ID,
      LOCATION_ID
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      req.body.name,
      req.body.time,
      req.body.end_time,
      req.body.description,
      req.body.private,
      req.user.ID,
      req.params.location_id
    ]);
    return res.status(200).end();
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to add event'
    });
  }
});

eventRouter.post('/participate/:event_id', async (req: Request, res: Response) => {
  try {
    await query(`
    INSERT INTO participant(
      USER_ID,
      EVENT_ID
    ) VALUES (?, ?)
    `, [
      req.user.ID,
      req.params.event_id
    ]);
    return res.status(200).end();
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to participate in event'
    });
  }
});

eventRouter.delete('/participate/:event_id', async (req: Request, res: Response) => {
  try {
    await query(`
    DELETE FROM participant
    WHERE USER_ID = ?
      AND EVENT_ID = ?
    `, [
      req.user.ID,
      req.params.event_id
    ]);
    return res.status(200).end();
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to participate in event'
    });
  }
})


export default locationRouter;
