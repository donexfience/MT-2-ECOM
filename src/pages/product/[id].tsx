import React, { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { useProductById } from "@/hooks/product/useProductById";
import { Star, Heart, Shield, Truck, RotateCcw, Award } from "lucide-react";


const ProductDetailsPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { product, loading, error } = useProductById(id as string); 

  const [selectedVariant, setSelectedVariant] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Product Not Found
          </h2>
          <p className="text-gray-600">
            The product you&apos;re looking for doesn&apos;t exist.
          </p>
        </div>
      </div>
    );
  }

  const handleQuantityChange = (increment: number) => {
    setQuantity((prev) => Math.max(1, prev + increment));
  };

  const handleBuyNow = () => {
    router.push(`/checkout/${id}?quantity=${quantity}`);
  };

  const currentPrice = product.basePrice;
  const originalPrice = currentPrice + currentPrice * 0.2;
  const discount = Math.round(
    ((originalPrice - currentPrice) / originalPrice) * 100
  );

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-purple-900 text-white text-center py-2 text-sm">
        Free domestic shipping on orders over $100
      </header>

      <nav className="border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="text-2xl font-serif">SalesGood</div>
          <div className="flex space-x-8">
            <button className="text-gray-700 hover:text-gray-900">Home</button>
            <button className="text-gray-700 hover:text-gray-900">About</button>
            <button className="text-gray-700 hover:text-gray-900">Shop</button>
            <button className="text-gray-700 hover:text-gray-900">
              Contact
            </button>
            <button className="text-gray-700 hover:text-gray-900">About</button>
          </div>
          <div className="flex items-center space-x-4">
            <button className="text-gray-700 hover:text-gray-900">🔍</button>
            <button className="text-gray-700 hover:text-gray-900">🛒</button>
            <button className="text-gray-700 hover:text-gray-900">👤</button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="flex gap-4">
            <div className="flex flex-col space-y-4">
              {product.images &&
                product.images.slice(0, 5).map((image, index) => (
                  <button
                    key={index}
                    className={`w-20 h-20 border-2 rounded-lg overflow-hidden ${
                      selectedVariant === index
                        ? "border-purple-600"
                        : "border-gray-200"
                    }`}
                    onClick={() => setSelectedVariant(index)}
                  >
                    <Image
                      src={image || "/api/placeholder/80/80"}
                      alt={`${product.name} view ${index + 1}`}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
            </div>

            <div className="flex-1">
              <div className="relative aspect-square bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg overflow-hidden">
                <Image
                  src={
                    product.images?.[selectedVariant] ||
                    "/api/placeholder/500/500"
                  }
                  alt={product.name}
                  width={500}
                  height={500}
                  className="w-full h-full object-cover"
                />
                {discount > 0 && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded text-sm font-medium">
                    BEST SELLER
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wider mb-2">
                {product.category || "EVERYDAY HUMANS"}
              </p>
              <h1 className="text-3xl font-light text-gray-900 mb-4">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating)
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-600">
                  {product.reviewCount} reviews
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <span className="text-2xl font-medium text-gray-900">
                Rp {currentPrice.toLocaleString()}
              </span>
              {discount > 0 && (
                <>
                  <span className="text-lg text-gray-500 line-through">
                    Rp {originalPrice.toLocaleString()}
                  </span>
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">
                    -{discount}%
                  </span>
                </>
              )}
            </div>

            <p className="text-gray-600 leading-relaxed">
              {product.description}
            </p>

            {product.variants && product.variants.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">
                  Size:
                </h3>
                <div className="flex space-x-3">
                  {product.variants.map((variant, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedVariant(index)}
                      className={`px-6 py-2 border rounded-full text-sm font-medium transition-colors ${
                        selectedVariant === index
                          ? "bg-yellow-200 border-yellow-300 text-gray-900"
                          : "border-gray-300 text-gray-700 hover:border-gray-400"
                      }`}
                    >
                      { `Option ${index + 1}`}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center space-x-4">
              <div className="flex items-center border border-gray-300 rounded-md">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  className="px-3 py-2 text-gray-600 hover:text-gray-800"
                >
                  −
                </button>
                <span className="px-4 py-2 border-l border-r border-gray-300 min-w-[50px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  className="px-3 py-2 text-gray-600 hover:text-gray-800"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleBuyNow}
                className="flex-1 bg-purple-900 text-white py-3 px-6 rounded-md hover:bg-purple-800 transition-colors font-medium"
              >
                BUY NOW
              </button>

              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`p-3 border border-gray-300 rounded-md hover:border-gray-400 transition-colors ${
                  isWishlisted ? "text-red-500" : "text-gray-600"
                }`}
              >
                <Heart
                  className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`}
                />
              </button>
            </div>

            <div className="text-sm text-gray-600">
              Ships for free this week of February 14th. ℹ️
            </div>

            <div className="grid grid-cols-4 gap-4 py-6 border-t border-gray-200">
              <div className="text-center">
                <Shield className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                <div className="text-xs text-gray-600">
                  <div>Safe &</div>
                  <div>Non-toxic</div>
                </div>
              </div>
              <div className="text-center">
                <Award className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                <div className="text-xs text-gray-600">
                  <div>Dermatologist</div>
                  <div>Created</div>
                </div>
              </div>
              <div className="text-center">
                <RotateCcw className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                <div className="text-xs text-gray-600">
                  <div>Biodegradable</div>
                  <div>Ingredients</div>
                </div>
              </div>
              <div className="text-center">
                <Truck className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                <div className="text-xs text-gray-600">
                  <div>Vegan &</div>
                  <div>Cruelty-free</div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <button className="w-full flex justify-between items-center py-3 text-left">
                <span className="text-lg font-medium text-gray-900">
                  Detail
                </span>
                <span className="text-gray-500">−</span>
              </button>
              <div className="pb-4 text-gray-600 text-sm leading-relaxed">
                {product.description}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
