import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useOrderDetails } from "@/hooks/order/useOrderDetails";
import { useAuth } from "@/hooks/auth/useAuth";
import {
  CheckCircle,
  XCircle,
  Package,
  User,
  Mail,
  MapPin,
  Calendar,
  CreditCard,
  Home,
  RefreshCw,
  ArrowRight,
} from "lucide-react";
import { LoadingScreen } from "@/components/Loadingscreen";
import { OrderFailedPage } from "@/components/OrderFailPage";

const ThankYouPage = () => {
  const user = useAuth();
  const router = useRouter();
  const { orderId } = router.query;
  const { order, loading, error } = useOrderDetails(orderId);

  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => setShowContent(true), 300);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (error || !order) {
    return <OrderFailedPage error={error} onRetry={() => router.reload()} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div
          className={`text-center mb-8 transition-all duration-1000 transform ${
            showContent
              ? "translate-y-0 opacity-100"
              : "translate-y-8 opacity-0"
          }`}
        >
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-green-100 rounded-full animate-ping"></div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Order Confirmed!
          </h1>
          <p className="text-xl text-gray-600">
            Thank you for your purchase. Your order is being processed.
          </p>
        </div>

        {/* Main Content Card */}
        <div
          className={`bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden transition-all duration-1000 delay-300 transform ${
            showContent
              ? "translate-y-0 opacity-100"
              : "translate-y-8 opacity-0"
          }`}
        >
          <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold mb-1">Order Number</h2>
                <p className="text-green-100 font-mono text-sm break-all">
                  #{order._id}
                </p>
              </div>
              <Package className="w-12 h-12 text-green-100" />
            </div>
          </div>

          <div className="p-8 space-y-8">
            <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-2xl border border-green-200">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-green-800">
                  Order Status: {order.order_status}
                </h3>
                <p className="text-green-600 text-sm">
                  Created on{" "}
                  {new Date(order.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Package className="w-5 h-5 mr-2 text-blue-500" />
                Order Items
              </h3>
              <div className="space-y-3">
                {order.products?.map((product: any, index: any) => (
                  <div
                    key={product._id || index}
                    className={`flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-200 transition-all duration-500 delay-${
                      index * 100
                    } transform ${
                      showContent
                        ? "translate-x-0 opacity-100"
                        : "translate-x-8 opacity-0"
                    }`}
                  >
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">
                        {product.name || "Product"}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Quantity: {product.quantity || 1}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-gray-900">
                        ₹
                        {(
                          (product.price || 0) * (product.quantity || 1)
                        ).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}

                <div className="border-t-2 border-gray-200 pt-4">
                  <div className="flex justify-between items-center p-4 bg-blue-50 rounded-xl">
                    <span className="text-xl font-bold text-gray-900">
                      Total Amount
                    </span>
                    <span className="text-2xl font-bold text-blue-600">
                      ₹{order.total_amount || "0.00"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer & Payment Info */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Customer Info */}
              <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2 text-purple-500" />
                  Customer Details
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-3 text-gray-400" />
                    <span className="text-gray-700">{order.customer_name}</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-3 text-gray-400" />
                    <span className="text-gray-700">
                      {order.customer_email}
                    </span>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="w-4 h-4 mr-3 text-gray-400 mt-1" />
                    <div className="text-gray-700">
                      <p>{order.address_id?.street}</p>
                      <p>
                        {order.address_id?.city}, {order.address_id?.state}
                      </p>
                      <p>
                        {order.address_id?.zip}, {order.address_id?.country}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <CreditCard className="w-5 h-5 mr-2 text-green-500" />
                  Payment Details
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Payment Method</span>
                    <span className="font-semibold text-gray-900 capitalize">
                      {order.payment?.payment_method || "Card"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Transaction ID</span>
                    <span className="font-mono text-sm text-gray-900">
                      {order.payment?._id || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Status</span>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                      {order.payment?.transaction_status || "Approved"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Confirmation Message */}
            <div className="text-center p-6 bg-blue-50 rounded-2xl border border-blue-200">
              <Mail className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <p className="text-blue-800">
                Order confirmation has been sent to{" "}
                <strong>{order.customer_email}</strong>
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                onClick={() => router.push("/")}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center group"
              >
                <Home className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Continue Shopping
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => router.push("/orders")}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center group"
              >
                <Package className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                View Orders
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThankYouPage;
