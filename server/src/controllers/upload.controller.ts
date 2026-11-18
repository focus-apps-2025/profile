import { Request, Response, NextFunction } from 'express';

export const uploadFile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({
        success: false,
        message: 'No file was uploaded.',
      });
      return;
    }

    // Construct relative URL accessible via static /uploads route
    const fileUrl = `/uploads/${req.file.filename}`;

    res.status(200).json({
      success: true,
      message: 'File uploaded successfully.',
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        url: fileUrl,
      },
    });
  } catch (error) {
    next(error);
  }
};
