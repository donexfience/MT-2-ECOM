import React, { useMemo, useState } from "react";
import {
  Heart,
  ShoppingCart,
  User,
  Award,
  Shield,
  Truck,
  Headphones,
  Star,
} from "lucide-react";
import { useCategories } from "@/hooks/product/useCategories";
import { useProducts } from "@/hooks/product/useProducts";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

export default function FurnitureLandingPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const {
    categories: apiCategories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useCategories();
  const displayCategories = apiCategories ? [...apiCategories] : ["All"];

  const productParams = useMemo(
    () => ({
      category: selectedCategory === "All" ? undefined : selectedCategory,
      search: searchTerm || undefined,
      page: "1",
      limit: "12",
    }),
    [selectedCategory, searchTerm]
  );
  const { products, loading, error } = useProducts(productParams);

  const formatCurrency = (amount: any) => {
    return `Rp ${amount.toLocaleString("id-ID")}`;
  };

  const handleProductClick = (productId: any) => {
    router.push(`/product/${productId}`);
  };

  const features = [
    {
      icon: <Award className="w-12 h-12 text-gray-600" />,
      title: "High Quality",
      description: "Crafted from top materials",
    },
    {
      icon: <Shield className="w-12 h-12 text-gray-600" />,
      title: "Warranty Protection",
      description: "Over 2 years",
    },
    {
      icon: <Truck className="w-12 h-12 text-gray-600" />,
      title: "Free Shipping",
      description: "Order over 150 $",
    },
    {
      icon: <Headphones className="w-12 h-12 text-gray-600" />,
      title: "24 / 7 Support",
      description: "Dedicated support",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <header className="flex items-center justify-between px-6 py-4 bg-white shadow-sm">
        <div className="flex items-center space-x-8">
          <h1 className="text-2xl font-bold text-gray-900">SalesGood</h1>
          <nav className="hidden md:flex space-x-8">
            <a href="#" className="text-gray-700 hover:text-gray-900">
              Home
            </a>
            <a href="#" className="text-gray-700 hover:text-gray-900">
              Shop
            </a>
            <a href="#" className="text-gray-700 hover:text-gray-900">
              About
            </a>
            <a href="#" className="text-gray-700 hover:text-gray-900">
              Contact
            </a>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <Heart className="w-6 h-6 text-gray-600 cursor-pointer" />
          <ShoppingCart className="w-6 h-6 text-gray-600 cursor-pointer" />
          <User className="w-6 h-6 text-gray-600 cursor-pointer" />
        </div>
      </header>{" "}
      <section className="relative bg-gradient-to-r from-orange-50 to-orange-100 min-h-[600px] flex items-center">
        <div className="container mx-auto px-6 flex items-center">
          <div className="flex-1 max-w-lg">
            <h2 className="text-5xl font-bold text-gray-900 mb-4 leading-tight">
              High-Quality
              <br />
              Furniture Just
              <br />
              For You
            </h2>
            <p className="text-gray-600 mb-8 text-lg">
              Our furniture is made from selected and best quality materials
              that are suitable for your dream home
            </p>
            <button className="bg-orange-400 hover:bg-orange-500 text-white px-8 py-4 rounded-lg text-lg font-medium transition-colors">
              Shop Now
            </button>
          </div>
          <div className="flex-1 relative">
            <div className="relative">
              <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                <img src="sofa.webp" alt="Sofa" />
              </div>
              <div className="absolute bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-200 rounded"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Bohauss</h4>
                    <p className="text-sm text-gray-600">
                      Luxury big sofa 2-seat
                    </p>
                    <p className="font-bold text-orange-500">Rp 17.000.000</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute top-20 right-20 w-8 h-8 bg-orange-300 rounded-full opacity-60"></div>
        <div className="absolute top-40 right-40 w-4 h-4 bg-orange-200 rounded-full opacity-80"></div>
      </section>
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-8 bg-white">
        <div className="container mt-16 mx-auto flex items-center justify-center">
          {categoriesLoading ? (
            <div className="text-center py-4">Loading categories...</div>
          ) : categoriesError ? (
            <div className="text-center py-4 text-red-500">
              Error loading categories: {categoriesError}
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-4">
              {displayCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2 rounded-full transition-colors ${
                    selectedCategory === category
                      ? "bg-orange-400 text-white"
                      : "bg-white text-gray-700 hover:bg-orange-50 border border-gray-300"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>
      <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-orange-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-400 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block">
              <h2 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-orange-600 to-gray-900 bg-clip-text text-transparent mb-4">
                Our Products
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-orange-400 to-orange-600 mx-auto rounded-full"></div>
            </div>
            <p className="text-gray-600 text-lg mt-6 max-w-2xl mx-auto">
              Discover our carefully curated collection of premium products
            </p>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="inline-flex items-center space-x-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                <p className="text-lg text-gray-600">Loading products...</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md mx-auto">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
                <p className="text-red-600 font-medium">
                  Error loading products: {error}
                </p>
              </div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-12 max-w-md mx-auto">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-10 h-10 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M12 11V7"
                    />
                  </svg>
                </div>
                <p className="text-gray-500 text-xl font-medium mb-2">
                  No products found
                </p>
                <p className="text-gray-400">
                  Try adjusting your search criteria
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products.map((product: any) => (
                <div
                  key={product.id}
                  onClick={() => handleProductClick(product.id)}
                  className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden border border-gray-100 hover:border-orange-200 transform hover:-translate-y-2"
                >
                  <div className="relative overflow-hidden rounded-t-3xl">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-700"
                    />

                    <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-20">
                      <div className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white hover:scale-110 transition-all duration-200">
                        <Heart className="w-5 h-5 text-gray-600 hover:text-red-500 transition-colors" />
                      </div>
                    </div>

                    <div className="absolute top-6 left-6 z-20">
                      <span className="bg-gradient-to-r from-orange-400 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg backdrop-blur-sm">
                        {product.category}
                      </span>
                    </div>

                    <div className="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-30">
                      <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <button className="bg-white text-gray-900 px-8 py-3 rounded-full font-semibold shadow-xl hover:bg-gray-100 transition-colors">
                          Quick View
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-8">
                    <h3 className="font-bold text-xl text-gray-900 mb-3 group-hover:text-orange-500 transition-colors duration-300 leading-tight">
                      {product.name}
                    </h3>
                    <p
                      className="text-gray-600 text-sm mb-6 leading-relaxed overflow-hidden"
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {product.description}
                    </p>

                    <div className="flex items-center space-x-3 mb-6">
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 transition-colors duration-200 ${
                              i < Math.floor(product.rating)
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-gray-500 text-sm font-medium">
                        ({product.reviewCount})
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                          {formatCurrency(product.basePrice)}
                        </span>
                      </div>
                      <button className="bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-16">
            <button className="group relative inline-flex items-center justify-center px-12 py-4 text-lg font-semibold text-orange-500 border-2 border-orange-400 rounded-full overflow-hidden transition-all duration-300 hover:text-white">
              <span className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
              <span className="relative flex items-center space-x-2">
                <span>Show More Products</span>
                <svg
                  className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
