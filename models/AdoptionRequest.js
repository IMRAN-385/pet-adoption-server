import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema({
  petId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pet', required: true },
  petName: { type: String },
  requesterName: { type: String },
  requesterEmail: { type: String, required: true },
  pickupDate: { type: String },
  message: { type: String },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
}, { timestamps: true });

export default mongoose.model('AdoptionRequest', requestSchema);