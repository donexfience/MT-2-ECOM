import dbConnect from "@/lib/dbConnect";
import { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from "mongodb";
import product from "@/models/product";

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

    const productId = Array.isArray(id) ? id[0] : id;
    console.log(productId, "productId");

    const products = await product.findOne({ _id: new ObjectId(productId) });

    if (!products) {
      return res.status(404).json({ message: "Product not found" });
    }

    const transformedProduct = {
      id: products._id.toString(),
      name: products.name,
      description: products.description,
      basePrice: products.basePrice,
      currency: products.currency,
      images: products.images,
      rating: products.rating,
      reviewCount: products.reviewCount,
      category: products.category,
      variants: products.variants,
      inStock: products.inStock,
      stockQuantity: products.stockQuantity,
      tags: products.tags,
      createdAt: products.createdAt,
      updatedAt: products.updatedAt,
    };

    return res.status(200).json({ product: transformedProduct });
  } catch (error) {
    console.error("Error fetching product:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
