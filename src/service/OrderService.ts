import axiosInstance from "@/lib/axios";

export const orderService = {
  createOrder: async (orderData: any) => {
    const response = await axiosInstance.post("/api/order", orderData);
    return response.data;
  },
  getOrder: async (orderId: any) => {
    const response = await axiosInstance.get(`/api/order/${orderId}`);
    return response.data;
  },
};
