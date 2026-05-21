import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
};

// POST /api/auth/register
export const register = async (req, res) => {
  try {
    const usersCollection = req.usersCollection;
    const { name, email, password, photoURL } = req.body;

    const existing = await usersCollection.findOne({ email });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
      name,
      email,
      password: hashedPassword,
      photoURL: photoURL || '',
      createdAt: new Date(),
    };

    const result = await usersCollection.insertOne(user);
    const savedUser = { _id: result.insertedId, name, email, photoURL: photoURL || '' };

    const token = jwt.sign({ id: result.insertedId, email }, process.env.JWT_SECRET, { expiresIn: '30d' });
    res.cookie('token', token, cookieOptions);

    res.status(201).json({ success: true, user: savedUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/auth/login
export const login = async (req, res) => {
  try {
    const usersCollection = req.usersCollection;
    const { email, password } = req.body;

    const user = await usersCollection.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });

    const token = jwt.sign({ id: user._id, email }, process.env.JWT_SECRET, { expiresIn: '30d' });
    res.cookie('token', token, cookieOptions);

    const { password: _, ...safeUser } = user;
    res.json({ success: true, user: safeUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/auth/google
export const googleAuth = async (req, res) => {
  try {
    const usersCollection = req.usersCollection;
    const { name, email, photoURL } = req.body;

    let user = await usersCollection.findOne({ email });

    if (!user) {
      const newUser = { name, email, photoURL: photoURL || '', createdAt: new Date() };
      const result = await usersCollection.insertOne(newUser);
      user = { ...newUser, _id: result.insertedId };
    }

    const token = jwt.sign({ id: user._id, email }, process.env.JWT_SECRET, { expiresIn: '30d' });
    res.cookie('token', token, cookieOptions);

    const { password: _, ...safeUser } = user;
    res.json({ success: true, user: safeUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/auth/me
export const getMe = async (req, res) => {
  try {
    const usersCollection = req.usersCollection;
    const { ObjectId } = await import('mongodb');
    const user = await usersCollection.findOne(
      { _id: new ObjectId(req.user.id) },
      { projection: { password: 0 } }
    );
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/auth/logout
export const logout = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  });
  res.json({ success: true, message: 'Logged out' });
};