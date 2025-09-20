import mongoose from 'mongoose';
const IdeaSchema = new mongoose.Schema({ title:{type:String,required:true}, problemStatement:{type:String,required:true}, existingSolution:{type:String}, proposedSolution:{type:String,required:true}, expectedImpact:{type:String}, status:{type:String,enum:['Pending','Approved','Rejected'],default:'Pending'}, createdBy:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true} }, { timestamps:true });
export default mongoose.model('Idea', IdeaSchema);
