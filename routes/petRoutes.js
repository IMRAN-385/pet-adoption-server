import express from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import {
  getAllPets,
  getMyPets,
  getPetById,
  createPet,
  updatePet,
  deletePet,
} from '../controllers/petController.js';

const router = express.Router();

// ⚠️ IMPORTANT: specific routes BEFORE /:id
router.get('/',            getAllPets);
router.get('/my-listings', verifyToken, getMyPets);   // এটা /:id এর আগে
router.get('/:id',         getPetById);

router.post('/',    verifyToken, createPet);
router.put('/:id',  verifyToken, updatePet);
router.delete('/:id', verifyToken, deletePet);

export default router;