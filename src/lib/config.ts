
/**
 * @file This file contains the core business logic and configuration data 
 * for the application, such as investment packages, distributor levels, and commission tiers.
 * In a production environment, this data would be fetched from a secure backend API
 * connected to an admin control panel.
 */

// All monetary values are in KES.

// --- Silver Level Investment Packages ---
export const silverLevelPackages = [
  { name: "Silver Level 1", price: 1300, dailyReturn: 166, duration: 16, totalReturn: 2656 },
  { name: "Silver Level 2", price: 2800, dailyReturn: 393, duration: 15, totalReturn: 5895 },
  { name: "Silver Level 3", price: 3900, dailyReturn: 242, duration: 35, totalReturn: 8470 },
  { name: "Silver Level 4", price: 9750, dailyReturn: 318, duration: 70, totalReturn: 22260 },
  { name: "Silver Level 5", price: 20800, dailyReturn: 390, duration: 130, totalReturn: 50700 },
  { name: "Silver Level 6", price: 39000, dailyReturn: 512, duration: 200, totalReturn: 102400 },
  { name: "Silver Level 7", price: 65000, dailyReturn: 670, duration: 260, totalReturn: 174200 },
  { name: "Silver Level 8", price: 117000, dailyReturn: 1002, duration: 360, totalReturn: 360720 },
];

// --- Golden Level Distributor Tiers ---
export const distributorTiers = [
  { level: 'V1', monthlyIncome: 6500, purchasedProducts: 2, deposit: 39000 },
  { level: 'V2', monthlyIncome: 13000, purchasedProducts: 3, deposit: 78000 },
  { level: 'V3', monthlyIncome: 26000, purchasedProducts: 4, deposit: 156000 },
  { level: 'V4', monthlyIncome: 43333, purchasedProducts: 5, deposit: 260000 },
  { level: 'V5', monthlyIncome: 108333, purchasedProducts: 6, deposit: 650000 },
];

// --- Agent Commission Tiers ---
export const commissionTiers = [
  { referrals: 20, commission: 6500 },
  { referrals: 75, commission: 20000 },
  { referrals: 200, commission: 35000 },
  { referrals: 500, commission: 55000 },
  { referrals: 1000, commission: 120000 },
  { referrals: 2000, commission: 300000 },
];

// --- Company Deposit Information ---
// In a real application, these would be managed securely in an admin panel.
export const depositDetails = {
    mobileMoney: "N/A",
    crypto: {
        BTC: "N/A",
        ETH: "N/A",
        USDT: "N/A",
    },
    minipay: "N/A",
};
