import mongoose from 'mongoose';

const petSchema = new mongoose.Schema({
  name: { type: String, required: true },
  species: { type: String, required: true },
  breed: { type: String },
  age: { type: Number },
  adoptionFee: { type: Number, default: 0 },
  description: { type: String },
  image: { type: String },
  ownerEmail: { type: String, required: true },
  status: { type: String, enum: ['available', 'adopted'], default: 'available' },
}, { timestamps: true });

export default mongoose.model('Pet', petSchema);