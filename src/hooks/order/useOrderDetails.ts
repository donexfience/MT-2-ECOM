import { orderService } from "@/service/OrderService";
import { IOrder } from "@/types/IOrder";
import { useState, useEffect } from "react";

export const useOrderDetails = (orderId: string) => {
  const [order, setOrder] = useState<IOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const data = (await orderService.getOrder(orderId)) as IOrder;
        setOrder(data);
      } catch (err) {
        console.log(err);
        setError("failed to fetch");
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  return { order, loading, error };
};
