
'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import type { User } from '@/lib/types';

interface AuthContextType {
  authUser: FirebaseUser | null;
  user: User | null; // This will hold the user data from Firestore
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const initialUser: User = {
    id: 0,
    name: 'Guest',
    email: '',
    isAdmin: false,
    wallet: { id: 0, userId: 0, balance: 0, totalRecharge: 0, totalWithdrawal: 0 },
    investments: [],
    transactions: [],
    referralsMade: [],
};


export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authUser, setAuthUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setAuthUser(user);
      if (!user) {
        setUser(null);
        setLoading(false);
      }
    });
    
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (authUser) {
      const userDocRef = doc(db, "users", authUser.uid);
      const unsubscribeSnapshot = onSnapshot(userDocRef, (doc) => {
        if (doc.exists()) {
          setUser(doc.data() as User);
        } else {
          // Handle case where user exists in Auth but not Firestore
          setUser(null);
        }
        setLoading(false);
      }, (error) => {
        console.error("Error fetching user data:", error);
        setUser(null);
        setLoading(false);
      });

      return () => unsubscribeSnapshot();
    }
  }, [authUser]);


  if (loading) {
    return (
        <div className="flex items-center justify-center h-screen">
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

  return (
    <AuthContext.Provider value={{ authUser, user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
