import { productService } from "@/service/ProductService";
import { useState, useEffect } from "react";

export const useProducts = (params: any) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data: any = await productService.getProducts(params);
        setProducts(data.products);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [params]);

  return { products, loading, error };
};
