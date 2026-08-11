import mongoose from 'mongoose';

// Schema dan Model (Gambar)
const gambarSchema = new mongoose.Schema({
  gambar: String,
});

export default mongoose.model('Images', gambarSchema);
