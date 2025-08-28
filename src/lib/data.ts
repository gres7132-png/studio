
import { differenceInHours, parseISO } from 'date-fns';
import type { Package, User, DistributorLevel, Testimonial } from './types';

// Data based on user request:
// 1300 - receive daily 146 for 16days making a total of 2336.
// 2800 receive 373daily for 15days making a total of 5595.
// 3900 receive 212 daily for 35 days a total of 7420.
// 9750 receives 278 daily for 70days making 19460.
// 20800 makes 436 daily for 130 days making 56680 in total.
// 39000 makes 748 for 200 days tataling to 149600.
// 65000 makes 1000 daily for 260 days making 260000.

export const packages: Package[] = [
  { id: 1, name: "Marketer Tier 1", description: "Purchase of Balenciaga product marketing rights as a sales and marketer.", price: 1300, dailyReturn: 146, durationDays: 16, totalReturn: 2336, image: "", isActive: true },
  { id: 2, name: "Marketer Tier 2", description: "Purchase of Balenciaga product marketing rights as a sales and marketer.", price: 2800, dailyReturn: 373, durationDays: 15, totalReturn: 5595, image: "", isActive: true },
  { id: 3, name: "Marketer Tier 3", description: "Purchase of Balenciaga product marketing rights as a sales and marketer.", price: 3900, dailyReturn: 212, durationDays: 35, totalReturn: 7420, image: "", isActive: true },
  { id: 4, name: "Pro Marketer Tier 1", description: "Purchase of Balenciaga product marketing rights as a sales and marketer.", price: 9750, dailyReturn: 278, durationDays: 70, totalReturn: 19460, image: "", isActive: true },
  { id: 5, name: "Pro Marketer Tier 2", description: "Purchase of Balenciaga product marketing rights as a sales and marketer.", price: 20800, dailyReturn: 436, durationDays: 130, totalReturn: 56680, image: "", isActive: true },
  { id: 6, name: "Elite Marketer Tier 1", description: "Purchase of Balenciaga product marketing rights as a sales and marketer.", price: 39000, dailyReturn: 748, durationDays: 200, totalReturn: 149600, image: "", isActive: true },
  { id: 7, name: "Elite Marketer Tier 2", description: "Purchase of Balenciaga product marketing rights as a sales and marketer.", price: 65000, dailyReturn: 1000, durationDays: 260, totalReturn: 260000, image: "", isActive: true },
];

export const distributorLevels: DistributorLevel[] = [
    { level: 'V1', monthlyDividend: 6500, purchasedProducts: 2, deposit: 39000 },
    { level: 'V2', monthlyDividend: 13000, purchasedProducts: 3, deposit: 78000 },
    { level: 'V3', monthlyDividend: 26000, purchasedProducts: 4, deposit: 156000 },
    { level: 'V4', monthlyDividend: 43333, purchasedProducts: 5, deposit: 260000 },
    { level: 'V5', monthlyDividend: 108333, purchasedProducts: 6, deposit: 650000 },
];

export const mockUser: User = {
  id: 1,
  name: "Demo User",
  email: "user@example.com",
  mobile: "+254712345678",
  isAdmin: true,
  wallet: {
    id: 1,
    userId: 1,
    balance: 15000,
    totalRecharge: 20000,
    totalWithdrawal: 5000,
  },
  investments: [
    { id: 1, userId: 1, packageId: 1, package: packages[0], amount: 1300, startDate: "2024-07-10", endDate: "2024-07-26", status: 'active', earnings: 146 * 5, createdAt: "2024-07-10T10:00:00Z" },
    { id: 2, userId: 1, packageId: 2, package: packages[1], amount: 2800, startDate: "2024-06-01", endDate: "2024-06-16", status: 'completed', earnings: 5595, createdAt: "2024-06-01T11:00:00Z" }
  ],
  transactions: [
    { id: 1, userId: 1, type: 'deposit', amount: 10000, status: 'success', paymentMethod: 'Airtel Money', createdAt: "2024-07-15T09:00:00Z" },
    { id: 2, userId: 1, type: 'investment', amount: 1300, status: 'success', paymentMethod: 'wallet', createdAt: "2024-07-10T10:00:00Z" },
    { id: 3, userId: 1, type: 'withdrawal', amount: 2000, status: 'success', paymentMethod: 'wallet', createdAt: "2024-07-05T14:00:00Z" },
    { id: 4, userId: 1, type: 'commission', amount: 65, status: 'success', paymentMethod: 'referral', createdAt: "2024-07-02T18:00:00Z" },
    { id: 5, userId: 1, type: 'payout', amount: 146, status: 'success', paymentMethod: 'earnings', createdAt: "2024-07-14T10:00:00Z" },
    { id: 6, userId: 1, type: 'deposit', amount: 5000, status: 'pending', paymentMethod: 'Crypto (USDT)', createdAt: "2024-07-16T11:00:00Z" },
  ],
  referralsMade: [
      { id: 1, referrerId: 1, referredId: 2, referred: { name: 'Jane Doe', email: 'jane@example.com' }, commissionAmount: 65, createdAt: '2024-07-02T18:00:00Z' },
      { id: 2, referrerId: 1, referredId: 3, referred: { name: 'John Smith', email: 'john@example.com' }, commissionAmount: 140, createdAt: '2024-06-20T12:00:00Z' },
      { id: 3, referrerId: 1, referredId: 4, referred: { name: 'Alice', email: 'alice@example.com' }, commissionAmount: 195, createdAt: '2024-05-15T09:30:00Z' },
  ],
};

export const getTodaysEarnings = (user: User) => {
    const now = new Date();
    return user.investments
        .filter(inv => {
            if (inv.status !== 'active') return false;
            const investmentDate = parseISO(inv.createdAt);
            const hoursSinceInvestment = differenceInHours(now, investmentDate);
            return hoursSinceInvestment >= 24;
        })
        .reduce((total, inv) => total + inv.package.dailyReturn, 0);
};

export const allUsers: User[] = [
  mockUser,
  {
    id: 2, name: 'Jane Doe', email: 'jane@example.com', mobile: '+254723456789', isAdmin: false,
    wallet: { id: 2, userId: 2, balance: 500, totalRecharge: 1000, totalWithdrawal: 500 },
    investments: [],
    transactions: [],
    referralsMade: [],
  },
  {
    id: 3, name: 'John Smith', email: 'john@example.com', mobile: '+254734567890', isAdmin: false,
    wallet: { id: 3, userId: 3, balance: 2800, totalRecharge: 2800, totalWithdrawal: 0 },
    investments: [
      { id: 3, userId: 3, packageId: 2, package: packages[1], amount: 2800, startDate: "2024-07-01", endDate: "2024-07-16", status: 'active', earnings: 373 * 14, createdAt: "2024-07-01T11:00:00Z" }
    ],
    transactions: [],
    referralsMade: [],
  },
];

export const testimonials: Testimonial[] = [
  { id: 1, name: "John D.", location: "Nairobi, Kenya", message: "Just withdrew Ksh 5,595 earnings, this platform is amazing!", avatar: "JD" },
  { id: 2, name: "Emily K.", location: "Mombasa, Kenya", message: "My Marketer Tier 1 package is already paying off. Great returns!", avatar: "EK" },
  { id: 3, name: "David M.", location: "Kisumu, Kenya", message: "The deposit process with Airtel Money was so fast and easy.", avatar: "DM" },
  { id: 4, name: "Sarah W.", location: "Nakuru, Kenya", message: "Just bought the Pro Marketer Tier 1 package. Excited for the returns!", avatar: "SW" },
  { id: 5, name: "Michael O.", location: "Eldoret, Kenya", message: "Successfully withdrew my commissions. The referral program is top-notch.", avatar: "MO" },
  { id: 6, name: "Fatima A.", location: "Garissa, Kenya", message: "Reached V2 Distributor level! The monthly dividends are a game changer.", avatar: "FA" },
  { id: 7, name: "Peter N.", location: "Thika, Kenya", message: "Crypto deposit was smooth. I appreciate the modern options.", avatar: "PN" },
  { id: 8, name: "Lucy G.", location: "Nyeri, Kenya", message: "Customer support was very helpful with my verification.", avatar: "LG" },
  { id: 9, name: "Brian K.", location: "Machakos, Kenya", message: "Just received my daily return of Ksh 748, right on time.", avatar: "BK" },
  { id: 10, name: "Grace L.", location: "Kakamega, Kenya", message: "I love how easy it is to track my investments on the dashboard.", avatar: "GL" },
  { id: 11, name: "Kevin P.", location: "Meru, Kenya", message: "Just made my first investment. Let's go!", avatar: "KP" },
  { id: 12, name: "Brenda A.", location: "Malindi, Kenya", message: "Withdrew my earnings to buy a new phone. Thank you!", avatar: "BA" },
];
