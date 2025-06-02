import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    customer_name: { type: String, required: true },
    customer_email: { type: String, required: true },
    userId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    address_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
      required: true,
    },
    products: [
      {
        product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    total_amount: { type: Number, required: true },
    order_status: {
      type: String,
      enum: ["pending", "processing", "payment_declined", "payment_failed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
