import mongoose from 'mongoose';

const destinationSchema = new mongoose.Schema({
  idStr: { type: String, required: true },
  name: { type: String, required: true },
  properties: { type: Number, required: true },
  image: { type: String, required: true }
});

export default mongoose.model('Destination', destinationSchema);
