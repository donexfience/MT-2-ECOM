import { productService } from "@/service/ProductService";
import { IProduct } from "@/types/IOrder";
import { useState, useEffect } from "react";

export interface productByIdRes {
  product: IProduct;
}

export const useProductById = (id: string) => {
  const [product, setProduct] = useState<IProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = (await productService.getProductById(
          id
        )) as productByIdRes;
        setProduct(data.product);
      } catch (err) {
        console.log(err);
        setError("failed to fetch product");
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  return { product, loading, error };
};
