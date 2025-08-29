

import { differenceInHours, parseISO } from 'date-fns';
import type { User, Testimonial, Package, DistributorLevel } from './types';

// This data is now managed in Firestore. This is kept as a reference or for initial seeding.
export const packages: Package[] = [
  { id: "1", name: "Marketer Tier 1", description: "Purchase of Balenciaga product marketing rights as a sales and marketer.", price: 1300, dailyReturn: 146, durationDays: 16, totalReturn: 2336, image: "", isActive: true },
  { id: "2", name: "Marketer Tier 2", description: "Purchase of Balenciaga product marketing rights as a sales and marketer.", price: 2800, dailyReturn: 373, durationDays: 15, totalReturn: 5595, image: "", isActive: true },
  { id: "3", name: "Marketer Tier 3", description: "Purchase of Balenciaga product marketing rights as a sales and marketer.", price: 3900, dailyReturn: 212, durationDays: 35, totalReturn: 7420, image: "", isActive: true },
  { id: "4", name: "Pro Marketer Tier 1", description: "Purchase of Balenciaga product marketing rights as a sales and marketer.", price: 9750, dailyReturn: 278, durationDays: 70, totalReturn: 19460, image: "", isActive: true },
  { id: "5", name: "Pro Marketer Tier 2", description: "Purchase of Balenciaga product marketing rights as a sales and marketer.", price: 20800, dailyReturn: 436, durationDays: 130, totalReturn: 56680, image: "", isActive: true },
  { id: "6", name: "Elite Marketer Tier 1", description: "Purchase of Balenciaga product marketing rights as a sales and marketer.", price: 39000, dailyReturn: 748, durationDays: 200, totalReturn: 149600, image: "", isActive: true },
  { id: "7", name: "Elite Marketer Tier 2", description: "Purchase of Balenciaga product marketing rights as a sales and marketer.", price: 65000, dailyReturn: 1000, durationDays: 260, totalReturn: 260000, image: "", isActive: true },
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

export const distributorLevels: DistributorLevel[] = [
  { level: "V1", referralsNeeded: 0, monthlyDividend: 0, requiredTeamSize: 0, purchasePrice: 0 },
  { level: "V2", referralsNeeded: 10, monthlyDividend: 1000, requiredTeamSize: 30, purchasePrice: 1000 },
  { level: "V3", referralsNeeded: 20, monthlyDividend: 4000, requiredTeamSize: 60, purchasePrice: 4000 },
  { level: "V4", referralsNeeded: 50, monthlyDividend: 10000, requiredTeamSize: 150, purchasePrice: 10000 },
  { level: "V5", referralsNeeded: 100, monthlyDividend: 30000, requiredTeamSize: 300, purchasePrice: 30000 },
];

export const getTodaysEarnings = (user: User) => {
    const now = new Date();
    if (!user.investments) return 0;
    
    return user.investments
        .filter(inv => {
            if (inv.status !== 'active') return false;
            // A simple check: if the investment was created at least 24 hours ago.
            // A more robust solution would track the last payout date.
            const investmentDate = parseISO(inv.createdAt);
            const hoursSinceInvestment = differenceInHours(now, investmentDate);
            return hoursSinceInvestment >= 24;
        })
        .reduce((total, inv) => total + inv.package.dailyReturn, 0);
};

export const getDistributorLevel = (user: User): {
    currentLevel: DistributorLevel, 
    nextLevel: DistributorLevel | null,
    progress: number
} => {
    const referralCount = user.referralsMade?.length || 0;
    
    // Sort levels by referrals needed in descending order to find the current level
    const sortedLevels = [...distributorLevels].sort((a, b) => b.referralsNeeded - a.referralsNeeded);
    const currentLevel = sortedLevels.find(level => referralCount >= level.referralsNeeded) || distributorLevels[0];

    // Find the next level
    const nextLevel = distributorLevels.find(level => referralCount < level.referralsNeeded) || null;
    
    let progress = 0;
    if (nextLevel) {
        const referralsForCurrent = currentLevel?.referralsNeeded || 0;
        const referralsForNext = nextLevel.referralsNeeded;
        progress = ((referralCount - referralsForCurrent) / (referralsForNext - referralsForCurrent)) * 100;
    } else {
        progress = 100; // Max level reached
    }

    return { currentLevel, nextLevel, progress: Math.max(0, Math.min(progress, 100)) };
};
