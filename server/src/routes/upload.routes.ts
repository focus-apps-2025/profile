import { Router } from 'express';
import { uploadFile } from '../controllers/upload.controller';
import { upload } from '../middleware/upload';
import { authenticateAdmin } from '../middleware/auth';

const router = Router();

router.use(authenticateAdmin);
router.post('/', upload.single('file'), uploadFile);

export default router;
