import dbConnect from "@/lib/dbConnect";
import Address from "@/models/address";
import Order from "@/models/order";
import Product from "@/models/product";
import Payment from "@/models/payment";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await dbConnect();
    const {
      customer_name,
      customer_email,
      address,
      products,
      payment_method,
      userId,
      deliveryMethod,
      discount,
    } = req.body;
    console.log(req.body, "body in order");

    const newAddress = new Address(address);
    await newAddress.save();

    const productIds = products.map((p: any) => p.id);
    const productDocs = await Product.find({ _id: { $in: productIds } });

    const orderProducts = products.map((p: any) => {
      const productDoc = productDocs.find((pd) => pd._id.toString() === p.id);
      if (!productDoc) throw new Error(`Product ${p.id} not found`);

      const quantity = p.quantity || 1;
      if (quantity <= 0) {
        throw new Error(`Invalid quantity for product ${p.id}`);
      }

      return {
        product_id: p.id,
        quantity: quantity,
        price: productDoc.basePrice,
      };
    });

    let total_amount = orderProducts.reduce(
      (sum: number, p: any) => sum + p.price * p.quantity,
      0
    );

    const discountAmount = Number(discount) || 0;
    if (discountAmount < 0 || discountAmount > total_amount) {
      throw new Error("Invalid discount amount");
    }
    total_amount -= discountAmount;

    if (deliveryMethod === "normal") {
      total_amount += 10;
    } else if (deliveryMethod === "express") {
      total_amount += 10;
    } else if (deliveryMethod === "fast") {
      total_amount += 40;
    } else {
      throw new Error("Invalid delivery method");
    }

    if (isNaN(total_amount) || total_amount <= 0) {
      throw new Error("Invalid total amount calculated");
    }

    const newOrder = new Order({
      userId,
      customer_name,
      customer_email,
      address_id: newAddress._id,
      products: orderProducts,
      total_amount,
      order_status: "pending",
    });
    await newOrder.save();

    const newPayment = new Payment({
      order_id: newOrder._id,
      payment_method,
      amount: total_amount,
      transaction_status: "pending",
    });
    await newPayment.save();

    const outcome = Math.random();
    console.log(outcome, "outcome");
    if (outcome < 0.7) {
      newPayment.transaction_status = "approved";
      newOrder.order_status = "processing";
      for (const p of orderProducts) {
        const product = await Product.findById(p.product_id);
        if (!product) {
          throw new Error(`Product ${p.product_id} not found`);
        }
        if (product.stockQuantity < p.quantity) {
          console.log("product", product.stockQuantity, p.quantity);
          newOrder.order_status = "payment_failed";
          newPayment.transaction_status = "failed";
          await newOrder.save();
          await newPayment.save();
          throw new Error(`Insufficient stock for product ${p.product_id}`);
        }
        product.stockQuantity -= p.quantity;
        await product.save();
      }
    } else if (outcome > 0.7 && outcome < 0.9) {
      console.log("outcome 2");
      newPayment.transaction_status = "declined";
      newOrder.order_status = "payment_declined";
    } else {
      console.log("outcome2");
      newPayment.transaction_status = "failed";
      newOrder.order_status = "payment_failed";
    }

    await newPayment.save();
    await newOrder.save();

    res.status(201).json({
      order: newOrder,
      status: newOrder.order_status,
    });
  } catch (error: any) {
    console.error("Error creating order:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
}
