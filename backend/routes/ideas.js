import express from 'express';
import Idea from '../models/Idea.js';
import { auth, requireManager } from '../middleware/auth.js';
const router = express.Router();

router.post('/', auth, async (req,res)=>{ try{
  const { title, problemStatement, expectedImpact } = req.body;
  const idea = new Idea({ title, problemStatement, expectedImpact, createdBy: req.user.id, status:'pending' });
  await idea.save();
  res.status(201).json(idea);
}catch(e){ res.status(500).json({message:e.message}) } });

router.get('/my', auth, async (req,res)=>{ try{
  const ideas = await Idea.find({ createdBy: req.user.id }).sort({createdAt:-1});
  res.json(ideas);
}catch(e){ res.status(500).json({message:e.message}) } });

router.get('/all', auth, requireManager, async (req,res)=>{ try{
  const ideas = await Idea.find().populate('createdBy','name email').sort({createdAt:-1});
  res.json(ideas);
}catch(e){ res.status(500).json({message:e.message}) } });

async function changeStatus(req,res,newStatus){
  try{
    const i = await Idea.findById(req.params.id);
    if(!i) return res.status(404).json({message:'Not found'});
    i.status = newStatus;
    await i.save();
    res.json(i);
  }catch(e){ res.status(500).json({message:e.message}) }
}

router.post('/:id/approve', auth, requireManager, async (req,res)=> changeStatus(req,res,'approved'));
router.post('/:id/reject', auth, requireManager, async (req,res)=> changeStatus(req,res,'rejected'));
router.post('/:id/hold', auth, requireManager, async (req,res)=> changeStatus(req,res,'on-hold'));

export default router;
