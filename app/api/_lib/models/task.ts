import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  userId: {
    type: String,
    required: true,
  },
  
});

export default mongoose.models.Task || mongoose.model('Task', TaskSchema);