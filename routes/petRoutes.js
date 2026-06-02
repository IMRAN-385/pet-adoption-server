import express from 'express';
import { verifySession } from '../lib/middleware/verifySession.js';
import {
  getAllPets,
  getMyPets,
  getPetById,
  createPet,
  updatePet,
  deletePet,
} from '../controllers/petController.js';

const router = express.Router();

router.get('/',            getAllPets);
router.get('/my-listings', verifySession, getMyPets);
router.get('/:id',         getPetById);

router.post('/',      verifySession, createPet);
router.put('/:id',    verifySession, updatePet);
router.delete('/:id', verifySession, deletePet);

export default router;