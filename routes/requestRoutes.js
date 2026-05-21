import express from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import {
  submitRequest,
  getMyRequests,
  getPetRequests,
  updateRequestStatus,
  cancelRequest,
} from '../controllers/requestController.js';

const router = express.Router();

router.post('/pet/:petId',         verifyToken, submitRequest);
router.get('/my',                  verifyToken, getMyRequests);
router.get('/pet/:petId',          verifyToken, getPetRequests);
router.patch('/:id/status',        verifyToken, updateRequestStatus);
router.delete('/:id',              verifyToken, cancelRequest);

export default router;