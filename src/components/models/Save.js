import mongoose from 'mongoose';

const saveItemSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true },
  item: [
    {
      name: { type: String, required: true },
      itemId: { type: String, required: true },
      slug: { type: String, required: true, unique: true },
      category: { type: String, required: true },
      image: { type: String, required: true },
      price: { type: String, required: true },
      brand: { type: String, required: true },
      description: { type: String, required: true },
      rating: { type: Number, required: true, default: 0 },
      numReviews: { type: Number, required: true, default: 0 },
      countInStock: { type: Number, required: true, default: 0 },
    },
  ],
});

const Save1 = mongoose.models.Save1 || mongoose.model('Save1', saveItemSchema);
// const Save = mongoose.model('Save', saveItemSchema);

export default Save1;
