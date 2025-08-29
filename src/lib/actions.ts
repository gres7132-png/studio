
'use server';

import { doc, updateDoc, getDoc, arrayUnion, increment, runTransaction, collection, query, where, getDocs, writeBatch } from 'firebase/firestore';
import { db } from './firebase';
import type { User, Transaction, Investment, Package, Referral, DistributorLevel } from './types';
import { addDays, formatISO } from 'date-fns';
import { distributorLevels } from './data';


interface HandleTransactionParams {
    userId: string;
    type: 'deposit' | 'withdrawal';
    amount: number;
    paymentMethod: string;
}

export async function handleTransaction(params: HandleTransactionParams): Promise<{ success: boolean; error?: string }> {
    const { userId, type, amount, paymentMethod } = params;

    if (!userId) {
        return { success: false, error: 'User is not authenticated.' };
    }
    if (amount <= 0) {
        return { success: false, error: 'Transaction amount must be positive.' };
    }

    const userDocRef = doc(db, 'users', userId);

    try {
        await runTransaction(db, async (transaction) => {
            const userDoc = await transaction.get(userDocRef);
            if (!userDoc.exists()) {
                throw new Error('User not found.');
            }

            const user = userDoc.data() as User;
            const newTransactionData: Omit<Transaction, 'id' | 'userId'> = {
                type,
                amount,
                status: 'pending', // All transactions start as pending until admin approval
                paymentMethod,
                createdAt: new Date().toISOString(),
            };

            if (type === 'withdrawal') {
                const fee = amount * 0.15;
                const totalDeduction = amount; // Fee is just for information, admin should handle it.

                if (user.wallet.balance < totalDeduction) {
                    throw new Error('Insufficient balance to cover withdrawal.');
                }
                // For withdrawals, we just create the pending transaction.
                // An admin would later approve it and deduct the balance.
                transaction.update(userDocRef, {
                    transactions: arrayUnion({ ...newTransactionData, userId }),
                });

            } else { // Deposit
                // Similarly, deposits would need verification. For simulation, we'll mark as pending.
                 transaction.update(userDocRef, {
                    transactions: arrayUnion({ ...newTransactionData, userId }),
                });
            }
        });
        
        return { success: true };

    } catch (error) {
        console.error('Transaction error:', error);
        if (error instanceof Error) {
            return { success: false, error: error.message };
        }
        return { success: false, error: 'An unknown error occurred.' };
    }
}


interface HandleInvestmentParams {
    userId: string;
    packageId: string;
}

export async function handleInvestment(params: HandleInvestmentParams): Promise<{ success: boolean; error?: string }> {
    const { userId, packageId } = params;

    if (!userId) {
        return { success: false, error: 'User is not authenticated.' };
    }
    
    const packageDocRef = doc(db, "packages", packageId);
    const userDocRef = doc(db, 'users', userId);

    try {
        const batch = writeBatch(db);

        const packageDoc = await getDoc(packageDocRef);
        const userDoc = await getDoc(userDocRef);

        if (!packageDoc.exists()) {
            throw new Error("Invalid package selected.");
        }
        if (!userDoc.exists()) {
            throw new Error("User not found.");
        }
        
        const pkg = { ...packageDoc.data(), id: packageDoc.id } as Package;
        const user = userDoc.data() as User;

        if (user.wallet.balance < pkg.price) {
            throw new Error("Insufficient wallet balance for this purchase.");
        }

        const now = new Date();
        const newInvestment: Investment = {
            id: Date.now(),
            userId: user.uid,
            packageId: pkg.id,
            package: pkg,
            amount: pkg.price,
            startDate: formatISO(now),
            endDate: formatISO(addDays(now, pkg.durationDays)),
            status: 'active',
            earnings: 0,
            createdAt: formatISO(now),
        };

        const newTransaction: Omit<Transaction, 'id'> = {
            userId: user.uid,
            type: 'investment',
            amount: pkg.price,
            status: 'success',
            paymentMethod: 'wallet',
            createdAt: formatISO(now),
        };

        batch.update(userDocRef, {
            'wallet.balance': increment(-pkg.price),
            investments: arrayUnion(newInvestment),
            transactions: arrayUnion(newTransaction),
            hasInvested: true
        });

        // Handle referral commission if it's the user's first investment
        if (!user.hasInvested && user.referredBy) {
            const referrerDocRef = doc(db, 'users', user.referredBy);
            const referrerDoc = await getDoc(referrerDocRef);

            if (referrerDoc.exists()) {
                const commissionAmount = pkg.price * 0.05;
                const commissionTransaction: Omit<Transaction, 'id'> = {
                    userId: user.referredBy,
                    type: 'commission',
                    amount: commissionAmount,
                    status: 'success',
                    paymentMethod: `Referral: ${user.name}`,
                    createdAt: formatISO(now),
                };
                
                const newReferral: Referral = {
                    id: user.uid,
                    referrerId: user.referredBy,
                    referredId: user.uid,
                    referred: { name: user.name, email: user.email },
                    commissionAmount,
                    createdAt: formatISO(now),
                };

                batch.update(referrerDocRef, {
                    'wallet.balance': increment(commissionAmount),
                    transactions: arrayUnion(commissionTransaction),
                    referralsMade: arrayUnion(newReferral)
                });
            }
        }
        
        await batch.commit();

        return { success: true };
    } catch (error) {
        console.error('Investment error:', error);
        if (error instanceof Error) {
            return { success: false, error: error.message };
        }
        return { success: false, error: 'An unknown error occurred during the investment process.' };
    }
}


interface HandleDistributorshipPurchaseParams {
    userId: string;
    level: string;
}

export async function handleDistributorshipPurchase(params: HandleDistributorshipPurchaseParams): Promise<{ success: boolean; error?: string }> {
    const { userId, level } = params;
    
    if (!userId) {
        return { success: false, error: 'User is not authenticated.' };
    }

    const userDocRef = doc(db, 'users', userId);

    try {
        await runTransaction(db, async (transaction) => {
            const userDoc = await transaction.get(userDocRef);
            if (!userDoc.exists()) {
                throw new Error("User not found.");
            }
            
            const user = userDoc.data() as User;
            const levelData = distributorLevels.find(l => l.level === level);

            if (!levelData) {
                throw new Error("Invalid distributor level selected.");
            }
             if ((user.referralsMade?.length || 0) < levelData.referralsNeeded) {
                throw new Error("You have not met the referral requirements for this level.");
            }
            if (user.purchasedDividendLevel) {
                throw new Error("You have already purchased a distributorship level.");
            }
            if (user.wallet.balance < levelData.purchasePrice) {
                throw new Error("Insufficient wallet balance for this purchase.");
            }
            
            const now = new Date();
            const nowISO = formatISO(now);
            const newTransaction: Omit<Transaction, 'id'> = {
                userId: user.uid,
                type: 'distributorship',
                amount: levelData.purchasePrice,
                status: 'success',
                paymentMethod: `Purchase: ${levelData.level}`,
                createdAt: nowISO,
            };

            transaction.update(userDocRef, {
                'wallet.balance': increment(-levelData.purchasePrice),
                transactions: arrayUnion(newTransaction),
                purchasedDividendLevel: levelData.level,
                distributorshipPurchaseDate: nowISO,
                lastDividendPayoutDate: nowISO, // Set initial payout date
            });
        });

        return { success: true };
    } catch (error) {
        console.error('Distributorship purchase error:', error);
        if (error instanceof Error) {
            return { success: false, error: error.message };
        }
        return { success: false, error: 'An unknown error occurred during the purchase process.' };
    }
}

export async function handleDividendPayout(userId: string): Promise<{ success: boolean; error?: string }> {
    if (!userId) {
        return { success: false, error: 'User is not authenticated.' };
    }

    const userDocRef = doc(db, 'users', userId);
    try {
        await runTransaction(db, async (firestoreTransaction) => {
            const userDoc = await firestoreTransaction.get(userDocRef);
            if (!userDoc.exists() || !userDoc.data().purchasedDividendLevel) {
                // This isn't an error, just means user isn't eligible.
                return; 
            }

            const user = userDoc.data() as User;
            const levelData = distributorLevels.find(l => l.level === user.purchasedDividendLevel);

            if (!levelData || levelData.monthlyDividend <= 0) {
                 return; // No dividend to pay out.
            }
            
            const now = new Date();
            const nowISO = formatISO(now);
            const dividendAmount = levelData.monthlyDividend;

            const newTransaction: Omit<Transaction, 'id'> = {
                userId: user.uid,
                type: 'dividend',
                amount: dividendAmount,
                status: 'success',
                paymentMethod: `Monthly Payout: ${levelData.level}`,
                createdAt: nowISO,
            };

            firestoreTransaction.update(userDocRef, {
                'wallet.balance': increment(dividendAmount),
                transactions: arrayUnion(newTransaction),
                lastDividendPayoutDate: nowISO,
            });
        });

        return { success: true };
    } catch (error) {
        console.error('Dividend payout error:', error);
        if (error instanceof Error) {
            return { success: false, error: error.message };
        }
        return { success: false, error: 'An unknown error occurred during the dividend payout.' };
    }
}
