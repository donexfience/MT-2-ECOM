import User from "@/models/user";
import { Heart, ShoppingCart } from "lucide-react";
import React from "react";

const Header: React.FC = () => {
  return (
    <div>
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
      </header>
    </div>
  );
};

export default Header;
