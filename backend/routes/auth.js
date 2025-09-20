import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import nodemailer from 'nodemailer';
import { auth, requireAdmin } from '../middleware/auth.js';
const router = express.Router();

// Register - force role to 'user'
router.post('/register', async (req,res)=>{
  try{
    const { name, email, password } = req.body;
    if(!name||!email||!password) return res.status(400).json({message:'Missing'});
    let u = await User.findOne({email});
    if(u) return res.status(400).json({message:'Already exists'});
    const hash = await bcrypt.hash(password,10);
    u = new User({name,email,password:hash, role:'user'});
    await u.save();
    res.json({message:'Registered'});
  }catch(e){ res.status(500).json({message:e.message}) }
});

// Login - stage 1: verify credentials and send OTP
router.post('/login', async (req,res)=>{
  try{
    const { email, password } = req.body;
    if(!email||!password) return res.status(400).json({message:'Missing'});
    const u = await User.findOne({email});
    if(!u) return res.status(400).json({message:'Invalid'});
    const ok = await bcrypt.compare(password, u.password);
    if(!ok) return res.status(400).json({message:'Invalid'});
    // generate 6-digit otp
    const otp = Math.floor(100000 + Math.random()*900000).toString();
    u.otp = otp;
    u.otpExpiry = new Date(Date.now() + (parseInt(process.env.OTP_TTL_MIN || '10')*60*1000));
    await u.save();
    // send email - if configured
    try{
      if(process.env.SMTP_HOST){
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT||587),
          secure: process.env.SMTP_SECURE==='true',
          auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        });
        await transporter.sendMail({
          from: process.env.SMTP_FROM || process.env.SMTP_USER,
          to: u.email,
          subject: 'Your OTP for Ideal Portal',
          text: `Your OTP is ${otp}. It expires in ${process.env.OTP_TTL_MIN || 10} minutes.`
        });
      }
    }catch(e){
      console.warn('Mailer error', e.message);
    }
    // If in development/debug, return OTP in response for convenience
    if(process.env.DEBUG_OTP==='true'){
      return res.json({message:'OTP sent', otp});
    }
    res.json({message:'OTP sent'});
  }catch(e){ res.status(500).json({message:e.message}) }
});

// Verify OTP - stage 2: issue JWT
router.post('/verify-otp', async (req,res)=>{
  try{
    const { email, otp } = req.body;
    if(!email||!otp) return res.status(400).json({message:'Missing'});
    const u = await User.findOne({email});
    if(!u) return res.status(400).json({message:'Invalid'});
    if(!u.otp || !u.otpExpiry || u.otpExpiry < new Date()) return res.status(400).json({message:'OTP expired'});
    if(u.otp !== otp) return res.status(400).json({message:'Invalid OTP'});
    u.otp = null; u.otpExpiry = null; await u.save();
    const token = jwt.sign({id:u._id}, process.env.JWT_SECRET || 'secretkey', {expiresIn: '7d'});
    res.json({token, user:{name:u.name,email:u.email,role:u.role,id:u._id}});
  }catch(e){ res.status(500).json({message:e.message})}
});

// Admin: assign role
router.post('/assign-role', auth, requireAdmin, async (req,res)=>{
  try{
    const { userId, role } = req.body;
    if(!userId||!role) return res.status(400).json({message:'Missing'});
    if(!['user','manager','admin','expert'].includes(role)) return res.status(400).json({message:'Invalid role'});
    const u = await User.findById(userId);
    if(!u) return res.status(404).json({message:'User not found'});
    u.role = role; await u.save();
    res.json({message:'Role updated'});
  }catch(e){ res.status(500).json({message:e.message})}
});

// Simple route to list users (admin)
router.get('/users', auth, requireAdmin, async (req,res)=>{
  const users = await User.find().select('-password -otp -otpExpiry').sort({createdAt:-1});
  res.json(users);
});

export default router;
