import { isValidObjectId } from 'mongoose';
import Pet from '../models/Pet.js';

export const getAllPets = async (req, res) => {
  try {
    const { search, species, sort } = req.query;
    let query = { status: 'available' };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { breed: { $regex: search, $options: 'i' } },
      ];
    }

    if (species && species !== 'All') {
      query.species = { $in: [species] };
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'fee-asc')  sortOption = { adoptionFee: 1 };
    if (sort === 'fee-desc') sortOption = { adoptionFee: -1 };
    if (sort === 'name')     sortOption = { name: 1 };

    const pets = await Pet.find(query).sort(sortOption);
    res.json({ success: true, pets });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyPets = async (req, res) => {
  try {
    const pets = await Pet.find({ ownerEmail: req.user.email }).sort({ createdAt: -1 });
    res.json({ success: true, pets });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPetById = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id))
      return res.status(400).json({ message: 'Invalid pet ID' });

    const pet = await Pet.findById(req.params.id);
    if (!pet) return res.status(404).json({ message: 'Pet not found' });
    res.json({ success: true, pet });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createPet = async (req, res) => {
  try {
    const pet = await Pet.create({
      ...req.body,
      adoptionFee: Number(req.body.adoptionFee),
      ownerEmail: req.user.email,
      status: 'available',
    });
    res.status(201).json({ success: true, pet });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updatePet = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id))
      return res.status(400).json({ message: 'Invalid pet ID' });

    const existing = await Pet.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Pet not found' });
    if (existing.ownerEmail !== req.user.email)
      return res.status(403).json({ message: 'Not authorized' });

    const { _id, ...updateData } = req.body;
    if (updateData.adoptionFee) updateData.adoptionFee = Number(updateData.adoptionFee);

    const updated = await Pet.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json({ success: true, pet: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deletePet = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id))
      return res.status(400).json({ message: 'Invalid pet ID' });

    const existing = await Pet.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Pet not found' });
    if (existing.ownerEmail !== req.user.email)
      return res.status(403).json({ message: 'Not authorized' });

    await Pet.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Pet deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};