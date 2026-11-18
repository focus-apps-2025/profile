import { Request, Response, NextFunction } from 'express';
import { dataStore } from '../services/store';
import { createPortfolioSchema, updatePortfolioSchema } from '../validators/portfolio.validator';
import { normalizeSlug, validateSlug } from '../utils/slug';

export const getPortfolios = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string, 10) || 10));
    const search = (req.query.search as string || '').trim();
    const status = req.query.status as string;
    const role = req.query.role as string;
    const sortBy = (req.query.sortBy as string) || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

    const { portfolios, total } = await dataStore.getPortfolios({
      page,
      limit,
      search: search || undefined,
      status: ['draft', 'published', 'disabled'].includes(status) ? status : undefined,
      role: role || undefined,
      sortBy,
      sortOrder,
    });

    res.status(200).json({
      success: true,
      data: {
        portfolios,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit) || 1,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getPortfolioById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const portfolio = await dataStore.findPortfolioById(req.params.id);
    if (!portfolio) {
      res.status(404).json({
        success: false,
        message: 'Portfolio not found.',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: portfolio,
    });
  } catch (error) {
    next(error);
  }
};

export const createPortfolio = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const normalizedData = {
      ...req.body,
      slug: normalizeSlug(req.body.slug || req.body.fullName),
    };

    const validatedData = createPortfolioSchema.parse(normalizedData);

    const slugCheck = validateSlug(validatedData.slug);
    if (!slugCheck.isValid) {
      res.status(400).json({
        success: false,
        message: slugCheck.error,
      });
      return;
    }

    const isAvailable = await dataStore.checkSlugAvailable(validatedData.slug);
    if (!isAvailable) {
      res.status(409).json({
        success: false,
        message: `The slug '${validatedData.slug}' is already taken. Please choose another unique slug.`,
      });
      return;
    }

    const portfolio = await dataStore.createPortfolio(validatedData);

    res.status(201).json({
      success: true,
      message: 'Portfolio created successfully.',
      data: portfolio,
    });
  } catch (error) {
    next(error);
  }
};

export const updatePortfolio = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const portfolio = await dataStore.findPortfolioById(id);
    if (!portfolio) {
      res.status(404).json({
        success: false,
        message: 'Portfolio not found.',
      });
      return;
    }

    const rawData = { ...req.body };
    if (rawData.slug) {
      rawData.slug = normalizeSlug(rawData.slug);
      const slugCheck = validateSlug(rawData.slug);
      if (!slugCheck.isValid) {
        res.status(400).json({
          success: false,
          message: slugCheck.error,
        });
        return;
      }

      const isAvailable = await dataStore.checkSlugAvailable(rawData.slug, id);
      if (!isAvailable) {
        res.status(409).json({
          success: false,
          message: `The slug '${rawData.slug}' is already taken by another portfolio.`,
        });
        return;
      }
    }

    const validatedData = updatePortfolioSchema.parse(rawData);
    const updated = await dataStore.updatePortfolio(id, validatedData);

    res.status(200).json({
      success: true,
      message: 'Portfolio updated successfully.',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const deletePortfolio = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const success = await dataStore.deletePortfolio(id);

    if (!success) {
      res.status(404).json({
        success: false,
        message: 'Portfolio not found.',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Portfolio deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

export const updateStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['draft', 'published', 'disabled'].includes(status)) {
      res.status(400).json({
        success: false,
        message: 'Invalid status. Must be draft, published, or disabled.',
      });
      return;
    }

    const portfolio = await dataStore.updatePortfolio(id, { status });

    if (!portfolio) {
      res.status(404).json({
        success: false,
        message: 'Portfolio not found.',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: `Portfolio status updated to ${status}.`,
      data: portfolio,
    });
  } catch (error) {
    next(error);
  }
};

export const togglePublish = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const portfolio = await dataStore.findPortfolioById(id);

    if (!portfolio) {
      res.status(404).json({
        success: false,
        message: 'Portfolio not found.',
      });
      return;
    }

    const nextStatus = portfolio.status === 'published' ? 'draft' : 'published';
    const updated = await dataStore.updatePortfolio(id, { status: nextStatus });

    res.status(200).json({
      success: true,
      message: `Portfolio is now ${nextStatus}.`,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const checkSlug = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const rawSlug = (req.query.slug as string || '').trim();
    const currentId = req.query.currentId as string;

    const normalized = normalizeSlug(rawSlug);
    const validation = validateSlug(normalized);

    if (!validation.isValid) {
      res.status(200).json({
        success: true,
        data: {
          available: false,
          normalized,
          reason: validation.error,
        },
      });
      return;
    }

    const isAvailable = await dataStore.checkSlugAvailable(normalized, currentId);

    res.status(200).json({
      success: true,
      data: {
        available: isAvailable,
        normalized,
        reason: !isAvailable ? 'This slug is already taken.' : undefined,
      },
    });
  } catch (error) {
    next(error);
  }
};
