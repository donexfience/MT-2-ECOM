import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useForm, SubmitHandler } from "react-hook-form"; 
import { yupResolver } from "@hookform/resolvers/yup";
import { Loginschema } from "../../../utils/LoginSchema";
import { useRouter } from "next/router";
import axiosInstance from "@/lib/axios";
import { toast } from "react-fox-toast";
import Image from "next/image";

interface LoginFormData {
  email: string;
  password: string;
}

interface SignupFormData extends LoginFormData {
  username: string;
}

type FormData = LoginFormData | SignupFormData;

export default function CraxinnoLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<any>({
    resolver: yupResolver(Loginschema(isSignup)),
  });

  const onSubmit: SubmitHandler<any> = async (data: FormData) => {
    setLoading(true);

    try {
      if (isSignup) {
        const signupData = data as SignupFormData;
        const response = await axiosInstance.post("/auth/signup", {
          email: signupData.email,
          password: signupData.password,
          username: signupData.username, 
        });

        toast.success("Account created successfully! Please log in.");
        console.log("Signup successful:", response.data);
        setTimeout(() => {
          setIsSignup(false);
          reset();
        }, 2000);
      } else {
        const loginData = data as LoginFormData;
        const response = await axiosInstance.post("/auth/login", {
          email: loginData.email,
          password: loginData.password,
        });

        toast.success("Login successful! Redirecting...");
        console.log("Login successful:", response.data);
        setTimeout(() => {
          router.push("/");
        }, 1000);
      }
    } catch (err) {
      console.log(err, "error of login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex w-full">
      <div className="w-1/2 flex items-center justify-center bg-white">
        <Image
          alt="logo"
          height={100}
          width={1000}
          src="/Login/Login.jpg"
          className="w-[50%] h-[50%]"
        />
      </div>
      <div className="w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <div className="w-6 h-6 bg-white rounded-sm transform rotate-45"></div>
            </div>
            <h1 className="text-sm text-gray-600 mb-2">SaleSGood</h1>
            <h1 className="text-sm text-gray-600 mb-4">ECOM</h1>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {isSignup ? "Create Account" : "Welcome"}
            </h2>
            <h3 className="text-2xl font-bold text-gray-900">
              {isSignup ? "Sign up for SalesGood" : "To SalesGood"}
            </h3>
          </div>
          <div className="space-y-6">
            <div>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full max-w-md"
              >
                {isSignup && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      {...register("username")}
                      placeholder="Enter your Username"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      disabled={loading}
                    />
                    {errors.username && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.username && typeof errors.username.message === "string" && errors.username.message}
                      </p>
                    )}
                  </div>
                )}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      {...register("email")}
                      placeholder="Enter your Email"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                      disabled={loading}
                      required
                    />
                    {errors.email && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.email && typeof errors.email.message === "string" && errors.email.message}
                      </p>
                    )}
                    <div className="absolute right-3 top-3 text-gray-400">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      {...register("password")}
                      placeholder="Enter your Password"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors pr-12"
                      disabled={loading}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      disabled={loading}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                    {errors.password && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.password && typeof errors.password.message === "string" && errors.password.message}
                      </p>
                    )}
                  </div>
                </div>
                {!isSignup && (
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="remember"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        disabled={loading}
                      />
                      <label
                        htmlFor="remember"
                        className="ml-2 text-sm text-gray-600"
                      >
                        Remember Me
                      </label>
                    </div>
                    <a
                      href="#"
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Forgot Password?
                    </a>
                  </div>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading
                    ? isSignup
                      ? "Creating Account..."
                      : "Logging in..."
                    : isSignup
                    ? "Sign Up"
                    : "Login"}
                </button>
              </form>
            </div>
            <div className="text-center text-gray-500 text-sm">Or</div>
            <button
              type="button"
              disabled={loading}
              className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 focus:ring-4 focus:ring-gray-200 font-medium transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>Login with Google</span>
            </button>
            <div className="text-center text-sm text-gray-600 mt-6">
              {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
              <button
                onClick={() => {
                  setIsSignup(!isSignup);
                  reset();
                }}
                disabled={loading}
                className="text-blue-600 hover:text-blue-800 font-medium disabled:opacity-50"
              >
                {isSignup ? "Login here" : "Create here"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}