import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  options: [{ type: String }],
  answer: { type: String },
  type: { type: String, required: true },
  source: { type: String },
  uploadTime: { type: Date, default: Date.now },
  originalFile: {
    name: String,
    path: String
  }
});

export default mongoose.model('Question', questionSchema);