import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import {
  getPublicPortfolio,
  getPublicDirectory,
  submitContactInquiry,
} from '../controllers/public.controller';

const router = Router();

// Rate limiting for public contact submission
const inquiryLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: {
    success: false,
    message: 'Too many messages submitted from this connection. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

router.get('/portfolios', getPublicDirectory);
router.get('/portfolios/:slug', getPublicPortfolio);
router.post('/contact', inquiryLimiter, submitContactInquiry);

export default router;
