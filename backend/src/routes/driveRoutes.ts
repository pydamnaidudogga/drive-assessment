import express from 'express';
import { 
  saveToDrive, 
  listDriveFiles, 
  authorizeDrive ,
  callBackFunction,
  checkAccess,
  getAccess
} from '../controllers/driveController';
import { auth } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/save', auth, saveToDrive);
router.get('/documents', auth, listDriveFiles);
router.post('/authorize', auth, authorizeDrive);
router.get('/check-auth', auth, checkAccess);
router.get('/auth-url', auth, getAccess);
router.get('/callback', callBackFunction);
export default router;