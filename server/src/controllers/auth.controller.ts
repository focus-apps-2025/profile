import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { dataStore } from '../services/store';
import { loginSchema } from '../validators/auth.validator';
import { config } from '../config';
import { AuthenticatedRequest } from '../middleware/auth';

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const validatedData = loginSchema.parse(req.body);

    const admin = await dataStore.findAdminByEmail(validatedData.email);
    if (!admin) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password credentials.',
      });
      return;
    }

    const isMatch = await admin.comparePassword(validatedData.password);
    if (!isMatch) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password credentials.',
      });
      return;
    }

    // Update last login
    if (admin.save) {
      admin.lastLogin = new Date();
      await admin.save();
    }

    // Generate JWT
    const token = jwt.sign(
      { id: admin._id, email: admin.email, role: admin.role },
      config.jwtSecret,
      { expiresIn: '7d' }
    );

    // Set secure HTTP-only cookie
    res.cookie(config.cookieName, token, {
      httpOnly: true,
      secure: config.cookieSecure,
      sameSite: config.isProduction ? 'none' : 'lax',

      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });

    res.status(200).json({
      success: true,
      message: 'Login successful.',
      data: {
        token,
        user: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (_req: Request, res: Response): Promise<void> => {
  res.clearCookie(config.cookieName, {
    httpOnly: true,
    secure: config.cookieSecure,
    sameSite: config.isProduction ? 'none' : 'lax',

    path: '/',
  });

  res.status(200).json({
    success: true,
    message: 'Logged out successfully.',
  });
};

export const me = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  res.status(200).json({
    success: true,
    data: {
      user: req.user,
    },
  });
};
