import mongoose from 'mongoose';
const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ideal_portal';
    await mongoose.connect(uri, { dbName: process.env.MONGODB_DB || 'ideal_portal' });
    console.log('MongoDB connected...');
  } catch (err) { console.error('MongoDB connection error:', err.message); process.exit(1); }
};
export default connectDB;
