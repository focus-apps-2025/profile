import { Request, Response, NextFunction } from 'express';
import { dataStore } from '../services/store';
import { inquirySchema } from '../validators/portfolio.validator';
import { normalizeSlug } from '../utils/slug';

export const getPublicPortfolio = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const rawSlug = req.params.slug;
    const slug = normalizeSlug(rawSlug);

    const { portfolio, redirectedFromHistory } = await dataStore.findPortfolioBySlug(slug);

    if (!portfolio) {
      res.status(404).json({
        success: false,
        message: 'Portfolio not found. The profile you are looking for does not exist or has been removed.',
      });
      return;
    }

    // Check status
    if (portfolio.status === 'disabled') {
      res.status(403).json({
        success: false,
        message: 'This portfolio is currently inactive or disabled.',
        status: 'disabled',
      });
      return;
    }

    if (portfolio.status === 'draft') {
      res.status(404).json({
        success: false,
        message: 'This portfolio is currently in draft mode and not publicly available.',
        status: 'draft',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: portfolio,
      redirectSlug: redirectedFromHistory ? portfolio.slug : undefined,
    });
  } catch (error) {
    next(error);
  }
};

export const getPublicDirectory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const role = req.query.role as string;
    const search = (req.query.search as string || '').trim();
    const featuredOnly = req.query.featured === 'true';

    const { portfolios } = await dataStore.getPortfolios({
      status: 'published',
      showInDirectory: true,
      isFeatured: featuredOnly ? true : undefined,
      role: role || undefined,
      search: search || undefined,
      limit: 100,
    });

    res.status(200).json({
      success: true,
      data: portfolios,
    });
  } catch (error) {
    next(error);
  }
};

export const submitContactInquiry = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const validatedData = inquirySchema.parse(req.body);
    const slug = normalizeSlug(validatedData.portfolioSlug);

    const { portfolio } = await dataStore.findPortfolioBySlug(slug);

    if (!portfolio || portfolio.status !== 'published') {
      res.status(404).json({
        success: false,
        message: 'Target portfolio not found or not currently active.',
      });
      return;
    }

    if (!portfolio.contactEnabled) {
      res.status(403).json({
        success: false,
        message: 'Direct messaging is currently disabled for this portfolio.',
      });
      return;
    }

    await dataStore.createInquiry({
      portfolioId: portfolio._id?.toString() || 'id',
      portfolioSlug: portfolio.slug,
      senderName: validatedData.senderName,
      senderEmail: validatedData.senderEmail,
      subject: validatedData.subject || 'Portfolio Inquiry',
      message: validatedData.message,
    });

    res.status(201).json({
      success: true,
      message: 'Your message has been sent successfully! The professional will contact you soon.',
    });
  } catch (error) {
    next(error);
  }
};
