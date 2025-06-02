import axiosInstance from "@/lib/axios";
import { CreateOrderPayload } from "@/types/IOrder";

export const orderService = {
  createOrder: async (orderData: CreateOrderPayload) => {
    const response = await axiosInstance.post("/api/order", orderData);
    return response.data;
  },
  getOrder: async (orderId: string) => {
    const response = await axiosInstance.get(`/api/order/${orderId}`);
    return response.data;
  },
};
