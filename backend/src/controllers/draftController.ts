import { Request, Response } from 'express';
import Draft from '../models/Draft';

export const createDraft = async (req: any, res: Response): Promise<void> => {
  try {
    const { title, content } = req.body;
    
    const draft = new Draft({
      userId: req.user._id,
      title,
      content
    });
    await draft.save();
    res.status(201).json(draft);
  } catch (error) {
    res.status(400).json({ message: 'Error creating draft' });
  }
};

export const getDrafts = async (req: any, res: Response): Promise<void> => {
  try {
    let quary :any= {userId: req.user._id}
    let { id } = req.params;
    if(id){
        quary["_id"] = id
    }
    const drafts = await Draft.find(quary).sort({ lastUpdated: -1 });
    res.json(drafts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching drafts' });
  }
};

export const updateDraft = async (req: any, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    
    const draft = await Draft.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      { title, content, lastUpdated: Date.now() },
      { new: true }
    );
    
    if (!draft) {
      res.status(404).json({ message: 'Draft not found' });
      return;
    }
    
    res.json(draft);
  } catch (error) {
    res.status(400).json({ message: 'Error updating draft' });
  }
};