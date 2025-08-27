import type { Package, User } from './types';

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
    return user.investments
        .filter(inv => inv.status === 'active')
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
