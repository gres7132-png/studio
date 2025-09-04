"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { onAuthStateChanged, User, getAuth, Auth } from "firebase/auth";
import { getApp, getApps, initializeApp } from "firebase/app";
import { firebaseConfig } from "@/lib/firebase";
import { usePathname, useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

// --- Admin Configuration ---
// Add the email addresses of admin users to this array.
// This is a simple and secure way to manage roles for a small number of admins.
const ADMIN_EMAILS = ["gres7132@gmail.com"]; // Replace with your actual admin email

interface AuthContextType {
  user: User | null;
  loading: boolean;
  auth: Auth;
  isAdmin: boolean; // Flag to indicate if the user is an admin
}

// Initialize Firebase on the client side
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  auth: auth,
  isAdmin: false,
});

// Loading component to show while we check for authentication state
function AuthLoading() {
    return (
        <div className="flex h-screen items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                </div>
            </div>
        </div>
    );
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith('/auth');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        // Check if the logged-in user's email is in the admin list
        setIsAdmin(ADMIN_EMAILS.includes(user.email || ""));
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!loading) {
      if (user && isAuthPage) {
        router.push('/dashboard');
      } else if (!user && !isAuthPage) {
        router.push("/auth");
      }
    }
  }, [user, loading, isAuthPage, router]);

  if (loading && !isAuthPage) {
      return <AuthLoading />;
  }
  
  if ((!loading && user) || isAuthPage) {
      return <AuthContext.Provider value={{ user, loading, auth, isAdmin }}>{children}</AuthContext.Provider>;
  }

  return null;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
