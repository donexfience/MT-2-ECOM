import dbConnect from "@/lib/dbConnect";
import Order from "@/models/order";
import Payment from "@/models/payment";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await dbConnect();
    const { id } = req.query;

    const order = await Order.findById(id).populate("address_id").lean();
    const payment = await Payment.findOne({ order_id: id }).lean();
    console.log(order, "order");

    if (!order || !payment) {
      return res.status(404).json({ message: "Order or payment not found" });
    }

    res.status(200).json({ ...order, payment });
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
