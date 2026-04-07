import { Router, type Request, type Response } from 'express';

const profileRouter = Router();

profileRouter.get('/list', async (req: Request, res: Response) => {
  return res.status(200).end();
});

export default profileRouter;
