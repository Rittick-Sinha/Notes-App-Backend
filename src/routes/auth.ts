import { Router, Request, Response } from "express";
import Jwt, { Secret, SignOptions } from "jsonwebtoken";
import User from '../models/User';

const router = Router();

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 */
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    // Create token
    const signOptions: SignOptions = { expiresIn: String(process.env.JWT_EXPIRES_IN || '1d') };
    const token = Jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET as Secret,
      signOptions
    );

    // Return user + token
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error during login" });
  }
});

/**
 * @route   POST /api/auth/register
 * @desc    Register new user
 */
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { name, email, mobile, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "Email already in use" });
      return;
    }

    // Create new user
    const user = new User({ name, email, mobile, password });
    await user.save();

    // Generate JWT token
    const signOptions: SignOptions = { expiresIn: String(process.env.JWT_EXPIRES_IN || '1d') };
    const token = Jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET as Secret,
      signOptions
    );

    // Respond with user and token
    res.status(201).json({
      message: "Registration successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error during registration" });
  }
});

export default router;
