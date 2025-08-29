
'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import type { User } from '@/lib/types';
import { differenceInDays, parseISO } from 'date-fns';
import { handleDividendPayout } from '@/lib/actions';
import { useToast } from './use-toast';

interface AuthContextType {
  authUser: FirebaseUser | null;
  user: User | null; // This will hold the user data from Firestore
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authUser, setAuthUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

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
          const userData = doc.data() as User;
          setUser(userData);
          checkAndPayDividends(userData); // Check for dividends when user data is loaded/updated
        } else {
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

  const checkAndPayDividends = async (currentUser: User) => {
      if (currentUser && currentUser.purchasedDividendLevel && currentUser.lastDividendPayoutDate) {
        const lastPayoutDate = parseISO(currentUser.lastDividendPayoutDate);
        const daysSinceLastPayout = differenceInDays(new Date(), lastPayoutDate);

        if (daysSinceLastPayout >= 30) {
            console.log(`User ${currentUser.uid} is due for a dividend payout.`);
            const result = await handleDividendPayout(currentUser.uid);
            if(result.success) {
                toast({
                    title: "Dividend Paid!",
                    description: "Your monthly dividend has been added to your wallet.",
                });
            } else if (result.error) {
                 toast({
                    title: "Dividend Payout Failed",
                    description: result.error,
                    variant: "destructive",
                });
            }
        }
      }
  }

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
