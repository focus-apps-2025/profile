import { Router } from 'express';
import {
  getPortfolios,
  getPortfolioById,
  createPortfolio,
  updatePortfolio,
  deletePortfolio,
  updateStatus,
  togglePublish,
  checkSlug,
} from '../controllers/portfolio.controller';
import { authenticateAdmin } from '../middleware/auth';

const router = Router();

// Protect all admin portfolio routes
router.use(authenticateAdmin);

router.get('/', getPortfolios);
router.post('/', createPortfolio);
router.get('/check-slug', checkSlug);
router.get('/:id', getPortfolioById);
router.patch('/:id', updatePortfolio);
router.delete('/:id', deletePortfolio);
router.patch('/:id/publish', togglePublish);
router.patch('/:id/status', updateStatus);

export default router;
