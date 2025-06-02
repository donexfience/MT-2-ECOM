import { orderService } from "@/service/OrderService";
import { useState, useEffect } from "react";

export const useOrderDetails = (orderId: any) => {
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const data: any = await orderService.getOrder(orderId);
        setOrder(data);
      } catch (err: any) {
        setError(err.message);
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
