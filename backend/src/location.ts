import { response, Router, type Request, type Response } from 'express';
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
        name,
        description,
        time
      FROM event
      WHERE (name LIKE LOWER(?)
      OR description LIKE LOWER(?))
      AND LOCATION_ID = ?`, [
        '%' + req.query.q + '%',
        '%' + req.query.q + '%',
        req.params.location_id
      ]));
    else
      return res.status(200).json(await query(`
      SELECT
        name,
        description,
        time
      FROM event
      WHERE LOCATION_ID = ?
      ORDER BY name
      LIMIT 50`, [req.params.location_id]
      ));
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to search for location'
    });
  }
});

export default locationRouter;
