
import { differenceInHours, parseISO } from 'date-fns';
import type { User, DistributorLevel, Testimonial, Package } from './types';

// Data based on user request:
// 1300 - receive daily 146 for 16days making a total of 2336.
// 2800 receive 373daily for 15days making a total of 5595.
// 3900 receive 212 daily for 35 days a total of 7420.
// 9750 receives 278 daily for 70days making 19460.
// 20800 makes 436 daily for 130 days making 56680 in total.
// 39000 makes 748 for 200 days tataling to 149600.
// 65000 makes 1000 daily for 260 days making 260000.

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

export const distributorLevels: DistributorLevel[] = [
    { level: 'V1', monthlyDividend: 6500, purchasedProducts: 2, deposit: 39000 },
    { level: 'V2', monthlyDividend: 13000, purchasedProducts: 3, deposit: 78000 },
    { level: 'V3', monthlyDividend: 26000, purchasedProducts: 4, deposit: 156000 },
    { level: 'V4', monthlyDividend: 43333, purchasedProducts: 5, deposit: 260000 },
    { level: 'V5', monthlyDividend: 108333, purchasedProducts: 6, deposit: 650000 },
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
