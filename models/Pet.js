import mongoose from 'mongoose';

const petSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['dog', 'cat', 'rabbit', 'bird', 'other'], required: true },
  breed: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, enum: ['male', 'female'], required: true },
  size: { type: String, enum: ['small', 'medium', 'large'] },
  description: { type: String, required: true },
  images: [{ type: String }], // Cloudinary URLs
  location: { type: String, required: true },
  adoptionFee: { type: Number, default: 0 },
  vaccinated: { type: Boolean, default: false },
  owner: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['available', 'adopted', 'pending'], 
    default: 'available' 
  }
}, { timestamps: true });

export default mongoose.model('Pet', petSchema);