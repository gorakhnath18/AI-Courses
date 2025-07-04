import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true,
    trim: true 
  },
  password: { 
    type: String, 
    required: true 
  },
}, {
  // Automatically add 'createdAt' and 'updatedAt' fields
  timestamps: true 
});

const User = mongoose.model('User', userSchema);

export default User;