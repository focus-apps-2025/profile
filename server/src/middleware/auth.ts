import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { dataStore } from '../services/store';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

export const authenticateAdmin = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token = req.cookies?.[config.cookieName];

    // Fallback to Bearer token if not in cookies
    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Authentication required. Please log in to access this resource.',
      });
      return;
    }

    const decoded = jwt.verify(token, config.jwtSecret) as {
      id: string;
      email: string;
      role: string;
    };

    // Verify admin exists in database or dataStore
    const admin = await dataStore.findAdminById(decoded.id);
    if (!admin) {
      res.status(401).json({
        success: false,
        message: 'Account not found or session expired.',
      });
      return;
    }

    req.user = {
      id: admin._id.toString(),
      email: admin.email,
      name: admin.name,
      role: admin.role,
    };

    next();
  } catch (error: any) {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication token. Please log in again.',
    });
  }
};
