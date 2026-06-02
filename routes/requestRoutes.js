import express from 'express';
import { verifySession } from '../lib/middleware/verifySession.js'; 
import {
  submitRequest,
  getMyRequests,
  getPetRequests,
  updateRequestStatus,
  cancelRequest,
} from '../controllers/requestController.js';

const router = express.Router();

router.post('/pet/:petId',  verifySession, submitRequest);
router.get('/my',           verifySession, getMyRequests);
router.get('/pet/:petId',   verifySession, getPetRequests);
router.patch('/:id/status', verifySession, updateRequestStatus);
router.delete('/:id',       verifySession, cancelRequest);

export default router;