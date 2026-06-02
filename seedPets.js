import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Pet from './models/Pet.js';

dotenv.config();

const PLACEHOLDER_PETS = [
  {
    name: 'Cooper',
    species: 'Dog',
    breed: 'Pembroke Welsh Corgi',
    age: '2 Years',
    gender: 'Male',
    imageURL: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&q=80',
    healthStatus: 'Healthy',
    vaccinationStatus: 'Vaccinated',
    location: 'Dhaka',
    adoptionFee: 2000,
    description: 'Cooper is a playful and energetic Corgi who loves to run around and play fetch. He is great with kids and other animals.',
    ownerEmail: 'admin@pawshome.com',
    status: 'available',
  },
  {
    name: 'Luna',
    species: 'Cat',
    breed: 'Domestic Shorthair',
    age: '1 Year',
    gender: 'Female',
    imageURL: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&q=80',
    healthStatus: 'Healthy',
    vaccinationStatus: 'Vaccinated',
    location: 'Chittagong',
    adoptionFee: 1500,
    description: 'Luna is a gentle and affectionate cat who loves to cuddle. She is perfect for a quiet home and gets along well with other cats.',
    ownerEmail: 'admin@pawshome.com',
    status: 'available',
  },
  {
    name: 'Max',
    species: 'Dog',
    breed: 'French Bulldog',
    age: '3 Years',
    gender: 'Male',
    imageURL: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400&q=80',
    healthStatus: 'Healthy',
    vaccinationStatus: 'Vaccinated',
    location: 'Sylhet',
    adoptionFee: 3000,
    description: 'Max is a calm and lovable French Bulldog. He enjoys short walks and long naps on the couch. Great for apartment living.',
    ownerEmail: 'admin@pawshome.com',
    status: 'available',
  },
  {
    name: 'Bear',
    species: 'Dog',
    breed: 'German Shepherd',
    age: '4 Years',
    gender: 'Male',
    imageURL: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=400&q=80',
    healthStatus: 'Healthy',
    vaccinationStatus: 'Vaccinated',
    location: 'Rajshahi',
    adoptionFee: 2500,
    description: 'Bear is a loyal and intelligent German Shepherd. He is well-trained and protective. Needs an active family with space to roam.',
    ownerEmail: 'admin@pawshome.com',
    status: 'available',
  },
  {
    name: 'Mango',
    species: 'Cat',
    breed: 'Persian Cat',
    age: '8 Months',
    gender: 'Female',
    imageURL: 'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=400&q=80',
    healthStatus: 'Healthy',
    vaccinationStatus: 'Vaccinated',
    location: 'Dhaka',
    adoptionFee: 2000,
    description: 'Mango is a gentle and fluffy Persian kitten. She loves being brushed and sitting on laps. Very calm and easy to care for.',
    ownerEmail: 'admin@pawshome.com',
    status: 'available',
  },
  {
    name: 'Rio',
    species: 'Bird',
    breed: 'African Grey Parrot',
    age: '3 Years',
    gender: 'Male',
    imageURL: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=400&q=80',
    healthStatus: 'Healthy',
    vaccinationStatus: 'Vaccinated',
    location: 'Chittagong',
    adoptionFee: 5000,
    description: 'Rio is a highly intelligent African Grey who can mimic words and sounds. He needs an attentive owner who can spend time with him daily.',
    ownerEmail: 'admin@pawshome.com',
    status: 'available',
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Remove existing placeholder pets to avoid duplicates
    await Pet.deleteMany({ ownerEmail: 'admin@pawshome.com' });
    console.log('🗑️  Cleared old placeholder pets');

    const inserted = await Pet.insertMany(PLACEHOLDER_PETS);
    console.log(`🐾 Inserted ${inserted.length} pets successfully!`);

    inserted.forEach(p => console.log(`  ✔ ${p.name} (${p.species}) — ID: ${p._id}`));

  } catch (err) {
    console.error('❌ Seed failed:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

seed();