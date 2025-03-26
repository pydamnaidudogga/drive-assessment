import { Request, Response } from 'express';

import User from '../models/User';

import { FirebaseAdmin } from '../config/firebase';




export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { idToken } = req.body as { idToken: string };
    const decodedToken: any = await FirebaseAdmin.verifyIdToken(idToken);
    
    let user = await User.findOne({ firebaseId: decodedToken.uid });
    if (!user) {
      user = new User({
        firebaseId: decodedToken.uid,
        email: decodedToken.email,
        name: decodedToken.name || decodedToken.email.split('@')[0]
      });
      await user.save();
    }
    
    const token: string = user.generateAuthToken();
    
    res.json({ 
      token, 
      user: { 
        id: user._id, 
        email: user.email, 
        name: user.name 
      } 
    });
  } catch (error: unknown) {
    console.error('Login error:', error);
    if (error instanceof Error) {
      res.status(401).json({ message: error.message });
    } else {
      res.status(401).json({ message: 'Authentication failed' });
    }
  }
};