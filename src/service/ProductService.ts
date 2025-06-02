import axiosInstance from "@/lib/axios";

export const productService = {
  getProducts: async (params = {}) => {
    try {
      const response = await axiosInstance.get("/api/product", { params });
      return response.data;
    } catch (error) {
      console.log(error);

      throw new Error("Failed to fetch products");
    }
  },

  // Get single product by ID
  getProductById: async (id: string) => {
    try {
      const response = await axiosInstance.get(`/api/product/${id}`);
      return response.data;
    } catch (error) {
      console.log(error);
      throw new Error("Failed to fetch product");
    }
  },

  // Get product categories
  getCategories: async () => {
    try {
      const response = await axiosInstance.get("/api/product/category");
      return response.data;
    } catch (error) {
      console.log(error);

      throw new Error("Failed to fetch categories");
    }
  },

  // Search products
  searchProducts: async (searchTerm: string, filters = {}) => {
    try {
      const params = { search: searchTerm, ...filters };
      const response = await axiosInstance.get("/products", { params });
      return response.data;
    } catch (error) {
      console.log(error);

      throw new Error("Failed to search products");
    }
  },

  getProductsByCategory: async (category: string, params = {}) => {
    try {
      const response = await axiosInstance.get("/products", {
        params: { category, ...params },
      });
      return response.data;
    } catch (error) {
      console.log(error);

      throw new Error("Failed to fetch products by category");
    }
  },
};
