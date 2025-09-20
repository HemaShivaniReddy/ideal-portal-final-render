import mongoose from 'mongoose';
const CommentSchema = new mongoose.Schema({ text:{type:String,required:true}, user:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true}, createdAt:{type:Date,default:Date.now} });
const ForumTopic = new mongoose.Schema({ topic:{type:String,required:true}, createdBy:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true}, comments:[CommentSchema] }, { timestamps:true });
export default mongoose.model('ForumTopic', ForumTopic);
