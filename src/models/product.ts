import mongoose, { Schema, Document } from "mongoose";

const productSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    basePrice: { type: Number, required: true },
    currency: { type: String },
    images: { type: [String], default: [] },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    category: { type: String },
    variants: { type: [Schema.Types.Mixed], default: [] },
    inStock: { type: Boolean, default: true },
    stockQuantity: { type: Number, default: 0 },
    tags: { type: [String], default: [] },
  },
  { timestamps: true }
);

export default mongoose.models.Product ||
  mongoose.model("Product", productSchema);
