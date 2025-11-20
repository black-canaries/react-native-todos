import React, {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useState,
} from "react";
import { useConvexAuth } from "convex/react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AUTH_TOKEN_KEY = "convex_auth_token";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading: convexLoading } = useConvexAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const signInMutation = useMutation(api.auth.signIn);
  const signOutMutation = useMutation(api.auth.signOut);

  useEffect(() => {
    // Check for stored auth token on mount
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
      if (!token) {
        setIsLoading(false);
      }
    } catch (err) {
      console.error("Failed to check auth status:", err);
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      setIsLoading(true);
      await signInMutation({
        provider: "password",
        params: { email, password },
      });
      await AsyncStorage.setItem(AUTH_TOKEN_KEY, "authenticated");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setError(null);
      setIsLoading(true);
      await signInMutation({
        provider: "password",
        params: { email, password, flow: "signUp" },
      });
      await AsyncStorage.setItem(AUTH_TOKEN_KEY, "authenticated");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign up failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      await signOutMutation();
      await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign out failed");
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading: isLoading || convexLoading,
        signIn,
        signUp,
        signOut,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
