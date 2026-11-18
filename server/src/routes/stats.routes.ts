import { Router } from 'express';
import { getDashboardStats } from '../controllers/stats.controller';
import { authenticateAdmin } from '../middleware/auth';

const router = Router();

router.use(authenticateAdmin);
router.get('/', getDashboardStats);

export default router;
