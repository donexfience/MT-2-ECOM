import { productService } from "@/service/ProductService";
import { useState, useEffect } from "react";

interface CategoryResponse {
  categories: string[];
}

export const useCategories = () => {
  const [categories, setCategories] = useState(["All"]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = (await productService.getCategories()) as CategoryResponse;
        setCategories(data.categories);
      } catch (err) {
        console.log(err);
        setError("error fetching category");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
};
