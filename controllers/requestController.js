import mongoose from 'mongoose';
import Pet from '../models/Pet.js';
import AdoptionRequest from '../models/AdoptionRequest.js';

export const submitRequest = async (req, res) => {
  try {
    const petId = req.params.petId;

    const pet = await Pet.findById(petId);
    if (!pet) return res.status(404).json({ message: 'Pet not found' });
    if (pet.ownerEmail === req.user.email)
      return res.status(400).json({ message: 'You cannot adopt your own pet' });
    if (pet.status !== 'available')
      return res.status(400).json({ message: 'This pet is no longer available' });

    const existing = await AdoptionRequest.findOne({
      petId,
      requesterEmail: req.user.email,
      status: { $in: ['pending', 'approved'] },
    });
    if (existing)
      return res.status(400).json({ message: 'You already have a request for this pet' });

    const request = await AdoptionRequest.create({
      petId,
      petName: pet.name,
      requesterName: req.user.name,
      requesterEmail: req.user.email,
      pickupDate: req.body.pickupDate,
      message: req.body.message,
      status: 'pending',
    });

    res.status(201).json({ success: true, request });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyRequests = async (req, res) => {
  try {
    const requests = await AdoptionRequest.find({ requesterEmail: req.user.email })
      .populate('petId')
      .sort({ createdAt: -1 });

    res.json({ success: true, requests });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPetRequests = async (req, res) => {
  try {
    const petId = req.params.petId;

    const pet = await Pet.findById(petId);
    if (!pet) return res.status(404).json({ message: 'Pet not found' });
    if (pet.ownerEmail !== req.user.email)
      return res.status(403).json({ message: 'Not authorized' });

    const requests = await AdoptionRequest.find({ petId }).sort({ createdAt: -1 });
    res.json({ success: true, requests });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const id = req.params.id;

    if (!mongoose.isValidObjectId(id))
      return res.status(400).json({ message: 'Invalid request ID' });

    const request = await AdoptionRequest.findById(id);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    const pet = await Pet.findById(request.petId);
    if (!pet || pet.ownerEmail !== req.user.email)
      return res.status(403).json({ message: 'Not authorized' });

    request.status = status;
    await request.save();

    if (status === 'approved') {
      await Pet.findByIdAndUpdate(request.petId, { status: 'adopted' });
      await AdoptionRequest.updateMany(
        { petId: request.petId, _id: { $ne: id }, status: 'pending' },
        { $set: { status: 'rejected' } }
      );
    }

    res.json({ success: true, message: `Request ${status}` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const cancelRequest = async (req, res) => {
  try {
    const id = req.params.id;

    if (!mongoose.isValidObjectId(id))
      return res.status(400).json({ message: 'Invalid request ID' });

    const request = await AdoptionRequest.findById(id);
    if (!request) return res.status(404).json({ message: 'Request not found' });
    if (request.requesterEmail !== req.user.email)
      return res.status(403).json({ message: 'Not authorized' });

    await AdoptionRequest.findByIdAndDelete(id);
    res.json({ success: true, message: 'Request cancelled' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};