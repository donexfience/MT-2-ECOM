import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema(
  {
    order_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    payment_method: { type: String, required: true },
    amount: { type: Number, required: true },
    transaction_status: {
      type: String,
      enum: ["pending", "approved", "declined", "failed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Payment ||
  mongoose.model("Payment", PaymentSchema);
