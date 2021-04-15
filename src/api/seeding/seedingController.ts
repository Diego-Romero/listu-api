import { Router } from 'express';
import httpStatus from 'http-status';
import SeedingService from '../../services/seedingService/seedingService';

const seedingRouter = Router();
const service = new SeedingService();

seedingRouter.get(`/`, async (_req, res) => {
  try {
    await service.seedAll();
    res.sendStatus(httpStatus.OK);
  } catch (e) {
    res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
});

export default seedingRouter;
