import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useProductById } from "@/hooks/product/useProductById";
import {
  Truck,
  Lock,
  ArrowLeft,
  CreditCard,
  MapPin,
  User,
  Mail,
  Phone,
  AlertCircle,
} from "lucide-react";
import {
  formatCardNumber,
  formatExpiryDate,
  validateCardNumber,
  validateCVV,
  validateEmail,
  validateExpiryDate,
  validatePhone,
} from "@/lib/validations/validation";
import { useAuth } from "@/hooks/auth/useAuth";
import { orderService } from "@/service/OrderService";
import { CreateOrderPayload, createOrderResponse } from "@/types/IOrder";
import Image from "next/image";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface FormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  country: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  country?: string;
  terms?: string;
}

type DeliveryMethod = "normal" | "express" | "fast";

const CheckoutPage = () => {
  const router = useRouter();
  const { id, quantity: urlQuantity } = router.query;
  const { product, loading, error } = useProductById(id as string);
  const { user } = useAuth();

  const [quantity, setQuantity] = useState(1);
  const [discountCode, setDiscountCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [deliveryMethod, setDeliveryMethod] =
    useState<DeliveryMethod>("normal");

  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phoneNumber: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    country: "",
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  useEffect(() => {
    if (urlQuantity) {
      const qtyStr = Array.isArray(urlQuantity) ? urlQuantity[0] : urlQuantity;
      setQuantity(parseInt(qtyStr) || 1);
    }
  }, [urlQuantity]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Product Not Found
          </h2>
          <p className="text-gray-600">Unable to load product for checkout.</p>
        </div>
      </div>
    );
  }

  const basePrice = product.basePrice * quantity;
  const shipping = deliveryMethod === "fast" ? 40 : 10;
  const discount = discountApplied ? discountAmount : 0;
  const total = basePrice + shipping - discount;

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleApplyDiscount = () => {
    if (discountCode.toLowerCase() === "save10") {
      setDiscountApplied(true);
      setDiscountAmount(basePrice * 0.1);
    } else {
      setDiscountApplied(false);
      setDiscountAmount(0);
    }
  };

  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    if (!formData.fullName.trim()) errors.fullName = "Full name is required";
    if (!formData.email.trim()) errors.email = "Email is required";
    else if (!validateEmail(formData.email))
      errors.email = "Invalid email format";
    if (!formData.phoneNumber.trim())
      errors.phoneNumber = "Phone number is required";
    else if (!validatePhone(formData.phoneNumber))
      errors.phoneNumber = "Invalid phone number format";
    if (!formData.address.trim()) errors.address = "Address is required";
    if (!formData.city.trim()) errors.city = "City is required";
    if (!formData.state.trim()) errors.state = "State is required";
    if (!formData.zipCode.trim()) errors.zipCode = "ZIP code is required";
    if (!formData.cardNumber.trim())
      errors.cardNumber = "Card number is required";
    else if (!validateCardNumber(formData.cardNumber))
      errors.cardNumber = "Invalid card number (16 digits required)";
    if (!formData.expiryDate.trim())
      errors.expiryDate = "Expiry date is required";
    else if (!validateExpiryDate(formData.expiryDate))
      errors.expiryDate = "Invalid or past expiry date";
    if (!formData.cvv.trim()) errors.cvv = "CVV is required";
    else if (!validateCVV(formData.cvv))
      errors.cvv = "Invalid CVV (3 digits required)";
    if (!agreedToTerms) errors.terms = "Please agree to terms and conditions";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePayNow = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const TransformedForBackend: CreateOrderPayload = {
          userId: user?._id,
          payment_method: "card",
          customer_name: user?.username || formData.fullName,
          customer_email: user?.email || formData.email,
          address: {
            street: formData.address,
            city: formData.city,
            state: formData.state,
            zip: formData.zipCode,
            country: formData.country,
          },
          products: [{ ...product, quantity }],
          deliveryMethod,
          discount: discountApplied ? discountAmount : 0,
        };
        const response = (await orderService.createOrder(
          TransformedForBackend
        )) as createOrderResponse;
        console.log(response, "response");
        if (response.order._id && response.order.order_status == "processing") {
          router.push(`/thank-you?orderId=${response.order._id}`);
        } else {
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>transactoin failed"</AlertDescription>
          </Alert>;
        }
      } catch (error: unknown) {
        console.error(error);
        const errorMessage =
          error instanceof Error &&
          "response" in error &&
          typeof (error as { response?: { data?: { message?: string } } })
            .response?.data?.message === "string"
            ? (error as { response: { data: { message: string } } }).response
                .data.message
            : "Transaction declined. Please try again or contact support.";
        alert(errorMessage);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm">Back to cart</span>
          </button>
        </div>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Checkout</h1>
          <p className="text-gray-600">Complete your purchase securely</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-sm">1</span>
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Contact Information
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                  <User className="absolute left-3 top-6 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) =>
                      handleInputChange("fullName", e.target.value)
                    }
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                      formErrors.fullName
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    placeholder="Fredrik Jr."
                  />
                  {formErrors.fullName && (
                    <p className="text-red-500 text-sm mt-2">
                      {formErrors.fullName}
                    </p>
                  )}
                </div>
                <div className="relative">
                  <Mail className="absolute left-3 top-6 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                      formErrors.email
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    placeholder="fredrik@readysetgaps.com"
                  />
                  {formErrors.email && (
                    <p className="text-red-500 text-sm mt-2">
                      {formErrors.email}
                    </p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <div className="flex">
                    <select className="px-4 py-3 border border-r-0 border-gray-200 rounded-l-xl bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>+46</option>
                      <option>+91</option>
                      <option>+1</option>
                      <option>+44</option>
                    </select>
                    <div className="relative flex-1">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={(e) =>
                          handleInputChange("phoneNumber", e.target.value)
                        }
                        className={`w-full pl-10 pr-4 py-3 border rounded-r-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                          formErrors.phoneNumber
                            ? "border-red-500 bg-red-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        placeholder="311 223 721"
                      />
                    </div>
                  </div>
                  {formErrors.phoneNumber && (
                    <p className="text-red-500 text-sm mt-2">
                      {formErrors.phoneNumber}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-sm">2</span>
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Delivery Method
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => setDeliveryMethod("fast")}
                  className={`p-6 rounded-2xl border-2 transition-all text-left ${
                    deliveryMethod === "fast"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Truck
                      className={`w-6 h-6 ${
                        deliveryMethod === "fast"
                          ? "text-blue-600"
                          : "text-gray-400"
                      }`}
                    />
                    <span
                      className={`font-semibold ${
                        deliveryMethod === "fast"
                          ? "text-blue-600"
                          : "text-gray-700"
                      }`}
                    >
                      Same-day
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    Fast delivery within hours
                  </p>
                  <p className="text-lg font-bold text-gray-900">₹40</p>
                </button>
                <button
                  onClick={() => setDeliveryMethod("express")}
                  className={`p-6 rounded-2xl border-2 transition-all text-left ${
                    deliveryMethod === "express"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Truck
                      className={`w-6 h-6 ${
                        deliveryMethod === "express"
                          ? "text-blue-600"
                          : "text-gray-400"
                      }`}
                    />
                    <span
                      className={`font-semibold ${
                        deliveryMethod === "express"
                          ? "text-blue-600"
                          : "text-gray-700"
                      }`}
                    >
                      Express
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    2-3 business days
                  </p>
                  <p className="text-lg font-bold text-gray-900">₹10</p>
                </button>
                <button
                  onClick={() => setDeliveryMethod("normal")}
                  className={`p-6 rounded-2xl border-2 transition-all text-left ${
                    deliveryMethod === "normal"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <MapPin
                      className={`w-6 h-6 ${
                        deliveryMethod === "normal"
                          ? "text-blue-600"
                          : "text-gray-400"
                      }`}
                    />
                    <span
                      className={`font-semibold ${
                        deliveryMethod === "normal"
                          ? "text-blue-600"
                          : "text-gray-700"
                      }`}
                    >
                      Normal
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    5-7 business days
                  </p>
                  <p className="text-lg font-bold text-gray-900">₹10</p>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-sm">3</span>
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Shipping Address
                </h2>
              </div>
              <div className="space-y-6">
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                      formErrors.address
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    placeholder="Street Address"
                  />
                  {formErrors.address && (
                    <p className="text-red-500 text-sm mt-2">
                      {formErrors.address}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                      formErrors.city
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    placeholder="City"
                  />
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => handleInputChange("state", e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                      formErrors.state
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    placeholder="State"
                  />
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) =>
                      handleInputChange("country", e.target.value)
                    }
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                      formErrors.zipCode
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    placeholder="Country"
                  />
                  <input
                    type="text"
                    value={formData.zipCode}
                    onChange={(e) =>
                      handleInputChange("zipCode", e.target.value)
                    }
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                      formErrors.zipCode
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    placeholder="ZIP Code"
                  />
                </div>
                {(formErrors.city ||
                  formErrors.state ||
                  formErrors.zipCode) && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {formErrors.city && (
                      <p className="text-red-500 text-sm">{formErrors.city}</p>
                    )}
                    {formErrors.state && (
                      <p className="text-red-500 text-sm">{formErrors.state}</p>
                    )}
                    {formErrors.zipCode && (
                      <p className="text-red-500 text-sm">
                        {formErrors.zipCode}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-sm">4</span>
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Payment Method
                </h2>
              </div>
              <div className="space-y-6">
                <div className="relative">
                  <CreditCard className="absolute left-3 top-6 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.cardNumber}
                    onChange={(e) =>
                      handleInputChange(
                        "cardNumber",
                        formatCardNumber(e.target.value)
                      )
                    }
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                      formErrors.cardNumber
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                  />
                  {formErrors.cardNumber && (
                    <p className="text-red-500 text-sm mt-2">
                      {formErrors.cardNumber}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      value={formData.expiryDate}
                      onChange={(e) =>
                        handleInputChange(
                          "expiryDate",
                          formatExpiryDate(e.target.value)
                        )
                      }
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                        formErrors.expiryDate
                          ? "border-red-500 bg-red-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      placeholder="MM/YY"
                      maxLength={5}
                    />
                    {formErrors.expiryDate && (
                      <p className="text-red-500 text-sm mt-2">
                        {formErrors.expiryDate}
                      </p>
                    )}
                  </div>
                  <div>
                    <input
                      type="text"
                      value={formData.cvv}
                      onChange={(e) =>
                        handleInputChange(
                          "cvv",
                          e.target.value.replace(/\D/g, "")
                        )
                      }
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                        formErrors.cvv
                          ? "border-red-500 bg-red-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      placeholder="123"
                      maxLength={3}
                    />
                    {formErrors.cvv && (
                      <p className="text-red-500 text-sm mt-2">
                        {formErrors.cvv}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-start gap-3 pt-4">
                  <input
                    id="terms"
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5"
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm text-gray-600 leading-relaxed"
                  >
                    I have read and agree to the Terms and Conditions
                  </label>
                </div>
                {formErrors.terms && (
                  <p className="text-red-500 text-sm">{formErrors.terms}</p>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 sticky top-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Order Summary
                </h2>
                <span className="text-sm text-gray-500">
                  {quantity} item{quantity > 1 ? "s" : ""}
                </span>
              </div>
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl mb-6">
                <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={product.images?.[0] || "/api/placeholder/64/64"}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    width={50}
                    height={50}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 truncate">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-500">Qty: {quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    ₹{basePrice.toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="mb-6">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Discount code"
                  />
                  <button
                    onClick={handleApplyDiscount}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Apply
                  </button>
                </div>
                <p className="text-blue-600 text-sm mt-2">
                  Discount currently not available Coming in future
                </p>
              </div>
              <div className="space-y-3 pb-6 border-b border-gray-200">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">₹{basePrice.toFixed(2)}</span>
                </div>
                {discountApplied && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({discountCode})</span>
                    <span>-₹{discount.toFixed(1)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Service</span>
                  <span className="text-gray-900">+ ₹{shipping}</span>
                </div>
              </div>
              <div className="pt-6 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-semibold text-gray-900">
                    Total
                  </span>
                  <span className="text-2xl font-bold text-gray-900">
                    ₹{total.toFixed(2)}
                  </span>
                </div>
              </div>
              <button
                onClick={handlePayNow}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
              >
                Pay Now →
              </button>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mt-4">
                <Lock className="w-4 h-4" />
                <span>Secure Checkout - SSL Encrypted</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
