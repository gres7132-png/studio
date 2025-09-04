"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { onAuthStateChanged, User, getAuth, Auth } from "firebase/auth";
import { getApp, getApps, initializeApp } from "firebase/app";
import { firebaseConfig } from "@/lib/firebase";
import { usePathname, useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  auth: Auth;
}

// Initialize Firebase on the client side
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  auth: auth,
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
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith('/auth');

  useEffect(() => {
    // This listener is the core of our authentication state management.
    // It fires once when it's first attached, and again any time the user's auth state changes.
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    // Cleanup the listener when the component unmounts
    return () => unsubscribe();
  }, []); // The empty dependency array ensures this effect runs only once on mount

  useEffect(() => {
    // This effect handles routing logic based on the auth state.
    // It runs whenever `loading` or `user` changes.
    if (!loading) {
      if (user && isAuthPage) {
        // If the user is logged in and on an auth page, redirect to dashboard.
        router.push('/dashboard');
      } else if (!user && !isAuthPage) {
        // If the user is not logged in and not on an auth page, redirect to auth.
        router.push("/auth");
      }
    }
  }, [user, loading, isAuthPage, router]);

  // If we are still checking the auth state, and we are not on the public auth page,
  // show a loading screen to prevent a flicker of protected content.
  if (loading && !isAuthPage) {
      return <AuthLoading />;
  }
  
  // If we are done loading and the user is authenticated, OR if we are on the public auth page,
  // render the children components.
  if ((!loading && user) || isAuthPage) {
      return <AuthContext.Provider value={{ user, loading, auth }}>{children}</AuthContext.Provider>;
  }

  // This will be the case for an unauthenticated user trying to access a protected page
  // after the initial load. They will be redirected by the effect above, but we return null here.
  return null;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
