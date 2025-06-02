import { getAllProductParams } from "@/pages";
import { productService } from "@/service/ProductService";
import ProductResponse from "@/types/IOrder";
import { useState, useEffect } from "react";

export const useProducts = (params: getAllProductParams) => {
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = (await productService.getProducts(
          params
        )) as ProductResponse;
        setProducts(data.products);
      } catch (err) {
        console.log(err);
        setError("failed to fetch all products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [params]);

  return { products, loading, error };
};
