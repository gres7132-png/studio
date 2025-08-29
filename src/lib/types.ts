

export interface User {
  uid: string; // Firebase Auth UID
  name: string;
  email: string;
  mobile?: string;
  isAdmin: boolean;
  referredBy?: string | null;
  createdAt: string;
  wallet: Wallet;
  investments: Investment[];
  transactions: Transaction[];
  referralsMade: Referral[];
  id?: string; // Firestore document ID
}

export interface Package {
  id: number;
  name: string;
  description: string;
  price: number;
  dailyReturn: number;
  durationDays: number;
  totalReturn: number;
  image: string;
  isActive: boolean;
}

export interface Investment {
  id: number;
  userId: string;
  packageId: number;
  package: Package;
  amount: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'pending' | 'cancelled';
  earnings: number;
  createdAt: string;
}

export interface Transaction {
  id?: number;
  userId: string;
  type: 'deposit' | 'withdrawal' | 'investment' | 'commission' | 'payout';
  amount: number;
  status: 'success' | 'pending' | 'failed';
  paymentMethod: string;
  createdAt: string;
}

export interface Referral {
  id: number;
  referrerId: string;
  referredId: string;
  referred: {
    name: string;
    email: string;
  };
  commissionAmount: number;
  createdAt: string;
}

export interface Wallet {
  balance: number;
  totalRecharge: number;
  totalWithdrawal: number;
}

export interface DistributorLevel {
  level: string;
  monthlyDividend: number;
  purchasedProducts: number;
  deposit: number;
}

export interface Testimonial {
  id: number;
  name: string;
  location: string;
  message: string;
  avatar: string;
}
