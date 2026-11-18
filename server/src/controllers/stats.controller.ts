import { Request, Response, NextFunction } from 'express';
import { dataStore } from '../services/store';

export const getDashboardStats = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const stats = await dataStore.getStats();
    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};
