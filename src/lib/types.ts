
export interface User {
  id: number;
  name: string;
  email: string;
  mobile?: string;
  isAdmin: boolean;
  wallet: Wallet;
  investments: Investment[];
  transactions: Transaction[];
  referralsMade: Referral[];
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
  userId: number;
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
  id: number;
  userId: number;
  type: 'deposit' | 'withdrawal' | 'investment' | 'commission' | 'payout';
  amount: number;
  status: 'success' | 'pending' | 'failed';
  paymentMethod: string;
  createdAt: string;
}

export interface Referral {
  id: number;
  referrerId: number;
  referredId: number;
  referred: {
    name: string;
    email: string;
  };
  commissionAmount: number;
  createdAt: string;
}

export interface Wallet {
  id: number;
  userId: number;
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
