

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
  referralsMade: Referral[];
  id?: string; // Firestore document ID
  hasInvested?: boolean; // To track first investment for commission
  purchasedDividendLevel?: string;
  distributorshipPurchaseDate?: string;
  lastDividendPayoutDate?: string;
}

export interface Package {
  id: string; // Firestore document ID
  name:string;
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
  packageId: string; // Changed to string to match Firestore ID
  package: Package;
  amount: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'pending' | 'cancelled';
  earnings: number;
  createdAt: string;
}

export interface Transaction {
  id?: string; // Firestore document ID or a generated string
  userId: string;
  type: 'deposit' | 'withdrawal' | 'investment' | 'commission' | 'payout' | 'distributorship' | 'dividend';
  amount: number;
  status: 'success' | 'pending' | 'failed';
  paymentMethod: string;
  createdAt: string;
}

export interface Referral {
  id: string; // Using referred user's ID for uniqueness
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

export interface Testimonial {
  id: number;
  name: string;
  location: string;
  message: string;
  avatar: string;
}

export interface DistributorLevel {
  level: string;
  referralsNeeded: number;
  monthlyDividend: number;
  requiredTeamSize: number;
  purchasePrice: number;
}
