import { ObjectId } from 'mongodb';

// POST /api/requests/pet/:petId — submit adoption request
export const submitRequest = async (req, res) => {
  try {
    const { petsCollection, requestsCollection } = req;
    const petId = req.params.petId;

    const pet = await petsCollection.findOne({ _id: new ObjectId(petId) });
    if (!pet) return res.status(404).json({ message: 'Pet not found' });

    // Owner cannot request their own pet
    if (pet.ownerEmail === req.user.email)
      return res.status(400).json({ message: 'You cannot adopt your own pet' });

    // Pet must be available
    if (pet.status !== 'available')
      return res.status(400).json({ message: 'This pet is no longer available' });

    // Check duplicate request
    const existing = await requestsCollection.findOne({
      petId,
      requesterEmail: req.user.email,
      status: { $in: ['pending', 'approved'] },
    });
    if (existing)
      return res.status(400).json({ message: 'You already have a request for this pet' });

    const request = {
      petId,
      petName: pet.name,
      requesterName: req.user.name,
      requesterEmail: req.user.email,
      pickupDate: req.body.pickupDate,
      message: req.body.message,
      status: 'pending',
      createdAt: new Date(),
    };

    const result = await requestsCollection.insertOne(request);
    res.status(201).json({ success: true, request: { ...request, _id: result.insertedId } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/requests/my — logged in user's own requests
export const getMyRequests = async (req, res) => {
  try {
    const { requestsCollection, petsCollection } = req;
    const requests = await requestsCollection
      .find({ requesterEmail: req.user.email })
      .sort({ createdAt: -1 })
      .toArray();

    // Attach petId as object for frontend navigation
    const enriched = await Promise.all(
      requests.map(async (r) => {
        try {
          const pet = await petsCollection.findOne({ _id: new ObjectId(r.petId) });
          return { ...r, petId: pet || { _id: r.petId } };
        } catch {
          return r;
        }
      })
    );

    res.json({ success: true, requests: enriched });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/requests/pet/:petId — requests for a specific pet (owner only)
export const getPetRequests = async (req, res) => {
  try {
    const { petsCollection, requestsCollection } = req;
    const petId = req.params.petId;

    const pet = await petsCollection.findOne({ _id: new ObjectId(petId) });
    if (!pet) return res.status(404).json({ message: 'Pet not found' });
    if (pet.ownerEmail !== req.user.email)
      return res.status(403).json({ message: 'Not authorized' });

    const requests = await requestsCollection
      .find({ petId })
      .sort({ createdAt: -1 })
      .toArray();

    res.json({ success: true, requests });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PATCH /api/requests/:id/status — approve or reject
export const updateRequestStatus = async (req, res) => {
  try {
    const { petsCollection, requestsCollection } = req;
    const { status } = req.body; // 'approved' | 'rejected'
    const id = req.params.id;

    const request = await requestsCollection.findOne({ _id: new ObjectId(id) });
    if (!request) return res.status(404).json({ message: 'Request not found' });

    // Verify ownership
    const pet = await petsCollection.findOne({ _id: new ObjectId(request.petId) });
    if (!pet || pet.ownerEmail !== req.user.email)
      return res.status(403).json({ message: 'Not authorized' });

    await requestsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { status } }
    );

    if (status === 'approved') {
      // Mark pet as adopted
      await petsCollection.updateOne(
        { _id: new ObjectId(request.petId) },
        { $set: { status: 'adopted' } }
      );
      // Reject all other pending requests for this pet
      await requestsCollection.updateMany(
        { petId: request.petId, _id: { $ne: new ObjectId(id) }, status: 'pending' },
        { $set: { status: 'rejected' } }
      );
    }

    res.json({ success: true, message: `Request ${status}` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/requests/:id — cancel request (requester only)
export const cancelRequest = async (req, res) => {
  try {
    const { requestsCollection } = req;
    const id = req.params.id;

    const request = await requestsCollection.findOne({ _id: new ObjectId(id) });
    if (!request) return res.status(404).json({ message: 'Request not found' });
    if (request.requesterEmail !== req.user.email)
      return res.status(403).json({ message: 'Not authorized' });

    await requestsCollection.deleteOne({ _id: new ObjectId(id) });
    res.json({ success: true, message: 'Request cancelled' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};