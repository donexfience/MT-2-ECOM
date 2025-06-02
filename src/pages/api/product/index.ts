import dbConnect from "@/lib/dbConnect";
import product from "@/models/product";
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

    const {
      category,
      search,
      page = "1",
      limit = "12",
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const currentPage = Array.isArray(page)
      ? parseInt(page[0], 10)
      : parseInt(page, 10);
    const pageLimit = Array.isArray(limit)
      ? parseInt(limit[0], 10)
      : parseInt(limit, 10);
    const sortField = Array.isArray(sortBy) ? sortBy[0] : sortBy;
    const order = Array.isArray(sortOrder) ? sortOrder[0] : sortOrder;
    const categoryValue = Array.isArray(category) ? category[0] : category;
    const searchValue = Array.isArray(search) ? search[0] : search;

    const filter: any = { inStock: true };

    if (categoryValue && categoryValue !== "All") {
      filter.category = categoryValue;
    }

    if (searchValue) {
      filter.$or = [
        { name: { $regex: searchValue, $options: "i" } },
        { description: { $regex: searchValue, $options: "i" } },
        {
          tags: {
            $in: [new RegExp(searchValue, "i")],
          },
        },
      ];
    }

    const skip = (currentPage - 1) * pageLimit;

    const sort: Record<string, number> = {};
    sort[sortField] = order === "desc" ? -1 : 1;

    const products = await product.find(filter)
      .skip(skip)
      .limit(pageLimit)

    const totalProducts = await product
      .countDocuments(filter);

    const totalPages = Math.ceil(totalProducts / pageLimit);

    const transformedProducts = products.map((product: any) => ({
      id: product._id.toString(),
      name: product.name,
      description: product.description,
      basePrice: product.basePrice,
      currency: product.currency,
      image: product.images?.[0],
      images: product.images,
      rating: product.rating,
      reviewCount: product.reviewCount,
      category: product.category,
      variants: product.variants,
      inStock: product.inStock,
      stockQuantity: product.stockQuantity,
      tags: product.tags,
    }));

    res.status(200).json({
      products: transformedProducts,
      pagination: {
        currentPage,
        totalPages,
        totalProducts,
        hasNextPage: currentPage < totalPages,
        hasPrevPage: currentPage > 1,
      },
      filters: {
        category: categoryValue,
        search: searchValue,
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
