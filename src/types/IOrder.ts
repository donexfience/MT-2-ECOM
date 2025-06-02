import { Types } from "mongoose";
interface Variants {
  type: string;
  name: string;
}

interface ProductOption {
  value: string;
  label: string;
  priceModifier: number;
}

interface ProductVariant {
  type: string;
  name: string;
  options: ProductOption[];
}

interface Product {
  id: Types.ObjectId;
  name: string;
  description: string;
  basePrice: number;
  currency: string;
  image: string;
  images: string[];
  rating: number;
  reviewCount: number;
  category: string;
  variants: ProductVariant[];
  inStock: boolean;
  stockQuantity: number;
  tags: string[];
  ength:number
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalProducts: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface ProductResponse {
  products: Product[];
  pagination: Pagination;
  filters: Record<string, string>;
  
}

export default ProductResponse;

export interface IProduct {
  id: string;
  product_id: string;
  quantity: number;
  price: number;
  _id: Types.ObjectId;
  name: string;
  description?: string;
  basePrice: number;
  currency?: string;
  images: string[];
  rating: number;
  reviewCount: number;
  category?: string;
  variants: Variants[];
  inStock: boolean;
  stockQuantity: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface createOrderResponse {
  order: IOrder;
}

export interface IOrder {
  _id: string;
  customer_name: string;
  customer_email: string;
  userId: Types.ObjectId;
  address_id: {
    city: string;
    street: string;
    state: string;
    zip: string;
    country: string;
  };
  payment:{
    payment_method:string
    transaction_status:string
    _id:string

  }
  products: IProduct[];
  total_amount: number;
  order_status:
    | "pending"
    | "processing"
    | "payment_declined"
    | "payment_failed";
  createdAt: Date;
  updatedAt: Date;
}

interface OrderAddress {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface CreateOrderPayload {
  userId: string | undefined;
  payment_method: "card";
  customer_name: string;
  customer_email: string;
  address: OrderAddress;
  products: IProduct[];
  deliveryMethod: string;
  discount: number;
}
