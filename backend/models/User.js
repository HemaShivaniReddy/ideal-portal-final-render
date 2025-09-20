import mongoose from 'mongoose';
const UserSchema = new mongoose.Schema({
  name:{type:String,required:true},
  email:{type:String,required:true,unique:true},
  password:{type:String,required:true},
  role:{type:String,enum:['user','manager','admin','expert'],default:'user'},
  otp:{type:String,default:null},
  otpExpiry:{type:Date,default:null}
},{ timestamps:true });
export default mongoose.model('User', UserSchema);
