import { ArrowRight, Home, RefreshCw, XCircle } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export const OrderFailedPage = ({
  error,
  onRetry,
}: {
  error: string;
  onRetry: () => void;
}) => {
  const router = useRouter();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div
          className={`text-center mb-8 transition-all duration-1000 transform ${
            showContent
              ? "translate-y-0 opacity-100"
              : "translate-y-8 opacity-0"
          }`}
        >
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-red-100 rounded-full animate-pulse"></div>
            <XCircle className="relative w-20 h-20 text-red-500 mx-auto mb-4 animate-bounce" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-2">
            Order Failed
          </h1>
          <p className="text-xl text-gray-600">
            We encountered an issue processing your order.
          </p>
        </div>

        <div
          className={`bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden transition-all duration-1000 delay-300 transform ${
            showContent
              ? "translate-y-0 opacity-100"
              : "translate-y-8 opacity-0"
          }`}
        >
          <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white p-6">
            <div className="flex items-center">
              <XCircle className="w-8 h-8 mr-3" />
              <h2 className="text-xl font-semibold">Order Processing Error</h2>
            </div>
          </div>

          <div className="p-8 text-center space-y-6">
            <div className="p-6 bg-red-50 rounded-2xl border border-red-200">
              <h3 className="font-semibold text-red-800 mb-2">
                What happened?
              </h3>
              <p className="text-red-600">
                {error ||
                  "Unable to load order details. This could be due to a network issue or the order may not exist."}
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                What can you do?
              </h3>
              <div className="grid gap-4 text-left">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-gray-700">
                    <strong>1. Check your internet connection</strong> and try
                    refreshing the page
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-gray-700">
                    <strong>2. Verify the order ID</strong> in your email
                    confirmation
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-gray-700">
                    <strong>3. Contact customer support</strong> if the problem
                    persists
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                onClick={onRetry}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center group"
              >
                <RefreshCw className="w-5 h-5 mr-2 group-hover:rotate-180 transition-transform duration-500" />
                Try Again
              </button>
              <button
                onClick={() => router.push("/")}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center group"
              >
                <Home className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Go Home
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
