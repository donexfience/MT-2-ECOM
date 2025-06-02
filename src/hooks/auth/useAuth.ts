import axiosInstance from "@/lib/axios";
import { useState, useEffect } from "react";

interface User {
  userId: string;
  email: string;
  username:string
  _id:string
}

interface UseAuthReturn {
  user: User | null;

  loading: boolean;
  error: string | null;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const response: any = await axiosInstance.get("/api/auth/me");

        if (response) {
          setUser(response.data.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        setError("Failed to fetch user");
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  return { user, loading, error };
}
