import mongoose from 'mongoose';

const petSchema = new mongoose.Schema({
  name: { type: String, required: true },
  species: { type: String, required: true },
  breed: { type: String },
  age: { type: String },
  gender: { type: String },
  imageURL: { type: String },
  healthStatus: { type: String },
  vaccinationStatus: { type: String },
  location: { type: String },
  adoptionFee: { type: Number, default: 0 },
  description: { type: String },
  ownerEmail: { type: String, required: true },
  status: { type: String, enum: ['available', 'adopted'], default: 'available' },
}, { timestamps: true });

export default mongoose.model('Pet', petSchema);