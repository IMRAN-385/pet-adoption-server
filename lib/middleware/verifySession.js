import { auth } from '../auth.js';
import { fromNodeHeaders } from 'better-auth/node';

// ✅ verifyToken এর replacement
// আগে: jwt.verify(token) → এখন: auth.api.getSession()
export const verifySession = async (req, res, next) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      return res.status(401).json({ message: 'Not authorized. Please login.' });
    }

    // আগে req.user = decoded (JWT payload) ছিল
    // এখন req.user = full user object, req.session = session object
    req.user = session.user;
    req.session = session.session;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Session invalid or expired' });
  }
};

// ✅ adminOnly — আগের মতোই কাজ করে
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Admin access only' });
  }
};