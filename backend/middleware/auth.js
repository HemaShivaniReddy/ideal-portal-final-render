import jwt from 'jsonwebtoken';
import User from '../models/User.js';
export const auth = async (req,res,next)=>{
  try{
    const header = req.headers.authorization || req.headers.Authorization || req.headers.auth;
    if(!header) return res.status(401).json({message:'No token'});
    const token = header.split(' ')[1] || header;
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
    const user = await User.findById(decoded.id).select('-password -otp -otpExpiry');
    if(!user) return res.status(401).json({message:'Invalid token'});
    req.user = user;
    next();
  }catch(e){
    return res.status(401).json({message:'Invalid token'});
  }
};

export const requireManager = (req,res,next)=>{
  if(!req.user) return res.status(401).json({message:'Unauthorized'});
  if(req.user.role !== 'manager' && req.user.role !== 'admin') return res.status(403).json({message:'Manager required'});
  next();
};

export const requireAdmin = (req,res,next)=>{
  if(!req.user) return res.status(401).json({message:'Unauthorized'});
  if(req.user.role !== 'admin') return res.status(403).json({message:'Admin required'});
  next();
};
