import { Router } from 'express';
import authRoutes from './auth.routes';
import portfolioRoutes from './portfolio.routes';
import publicRoutes from './public.routes';
import statsRoutes from './stats.routes';
import uploadRoutes from './upload.routes';

const router = Router();

// Version 1 API routes
router.use('/auth', authRoutes);
router.use('/admin/portfolios', portfolioRoutes);
router.use('/admin/stats', statsRoutes);
router.use('/admin/upload', uploadRoutes);
router.use('/public', publicRoutes);

export default router;
