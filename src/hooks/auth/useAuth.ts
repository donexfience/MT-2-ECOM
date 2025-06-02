import axiosInstance from "@/lib/axios";
import { User } from "lucide-react";
import { useState, useEffect } from "react";

interface User {
  userId: string;
  email: string;
  username: string;
  _id: string;


}

interface Response {
  data: {
    user: User;
  };
}

interface UseAuthReturn {
  user: User | null;
  loading: boolean;
  error: string | null;
  logout: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const response: Response = await axiosInstance.get("/api/auth/me");
        if (response && response.data && response.data.user) {
          setUser(response.data.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.log(err)
        setError("Failed to fetch ");
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  const logout = async () => {
    try {
      await axiosInstance.post("/api/auth/logout");
      setUser(null);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return { user, loading, error, logout };
}
