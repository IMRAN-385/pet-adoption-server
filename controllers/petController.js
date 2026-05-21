import { ObjectId } from 'mongodb';

// GET /api/pets — all pets with search, filter, sort
export const getAllPets = async (req, res) => {
  try {
    const petsCollection = req.petsCollection;
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

    const pets = await petsCollection.find(query).sort(sortOption).toArray();
    res.json({ success: true, pets });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/pets/my-listings — logged in user's pets
export const getMyPets = async (req, res) => {
  try {
    const petsCollection = req.petsCollection;
    const pets = await petsCollection
      .find({ ownerEmail: req.user.email })
      .sort({ createdAt: -1 })
      .toArray();
    res.json({ success: true, pets });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/pets/:id — single pet
export const getPetById = async (req, res) => {
  try {
    const petsCollection = req.petsCollection;
    const pet = await petsCollection.findOne({ _id: new ObjectId(req.params.id) });
    if (!pet) return res.status(404).json({ message: 'Pet not found' });
    res.json({ success: true, pet });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/pets — create pet
export const createPet = async (req, res) => {
  try {
    const petsCollection = req.petsCollection;
    const pet = {
      ...req.body,
      adoptionFee: Number(req.body.adoptionFee),
      ownerEmail: req.user.email,
      status: 'available',
      createdAt: new Date(),
    };
    const result = await petsCollection.insertOne(pet);
    res.status(201).json({ success: true, pet: { ...pet, _id: result.insertedId } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/pets/:id — update pet
export const updatePet = async (req, res) => {
  try {
    const petsCollection = req.petsCollection;
    const id = req.params.id;
    const existing = await petsCollection.findOne({ _id: new ObjectId(id) });
    if (!existing) return res.status(404).json({ message: 'Pet not found' });
    if (existing.ownerEmail !== req.user.email)
      return res.status(403).json({ message: 'Not authorized' });

    const { _id, ...updateData } = req.body;
    if (updateData.adoptionFee) updateData.adoptionFee = Number(updateData.adoptionFee);

    await petsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    const updated = await petsCollection.findOne({ _id: new ObjectId(id) });
    res.json({ success: true, pet: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/pets/:id — delete pet
export const deletePet = async (req, res) => {
  try {
    const petsCollection = req.petsCollection;
    const id = req.params.id;
    const existing = await petsCollection.findOne({ _id: new ObjectId(id) });
    if (!existing) return res.status(404).json({ message: 'Pet not found' });
    if (existing.ownerEmail !== req.user.email)
      return res.status(403).json({ message: 'Not authorized' });

    await petsCollection.deleteOne({ _id: new ObjectId(id) });
    res.json({ success: true, message: 'Pet deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};