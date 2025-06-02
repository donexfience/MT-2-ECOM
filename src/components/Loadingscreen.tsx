import { Package } from "lucide-react";

export const LoadingScreen = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-blue-200 rounded-full animate-spin mx-auto mb-6"></div>
          <div className="absolute inset-0 w-20 h-20 border-4 border-blue-600 rounded-full animate-ping mx-auto"></div>
          <Package className="absolute inset-0 w-8 h-8 text-blue-600 m-auto animate-pulse" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Loading Order Details
        </h2>
        <p className="text-gray-600 animate-pulse">
          Please wait while we fetch your order information...
        </p>
      </div>
    </div>
  );
};
