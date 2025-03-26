import express from 'express';
import {  getDrafts,createDraft, updateDraft} from '../controllers/draftController';
import { auth } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/:id',auth, getDrafts);
router.get('/',auth, getDrafts);
router.post('/', auth, createDraft);
router.put('/:id',auth, updateDraft);

export default router;