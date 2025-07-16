import express from 'express';
import Note from '../models/Note';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const router = express.Router();

interface AuthRequest extends Request {
  userId?: string;
}

// ✅ Middleware to authenticate token
const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// ✅ Create a Note
router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { title, content } = req.body;
    const note = await Note.create({ title, content, user: req.userId });
    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// ✅ Get all Notes for User
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const notes = await Note.find({ user: req.userId });
    res.status(200).json(notes);
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// ✅ Update Note by ID
router.put('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      req.body,
      { new: true }
    );
    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.status(200).json(note);
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// ✅ Delete Note by ID
router.delete('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.status(200).json({ message: 'Note deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong' });
  }
});

export default router;
