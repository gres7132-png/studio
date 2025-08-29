
'use server';

import { doc, updateDoc, getDoc, arrayUnion, increment, runTransaction, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import type { User, Transaction, Investment, Package } from './types';
import { addDays, formatISO } from 'date-fns';


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
                const totalDeduction = amount + fee;

                if (user.wallet.balance < totalDeduction) {
                    throw new Error('Insufficient balance to cover withdrawal and fee.');
                }
                // For withdrawals, we just create the pending transaction.
                // An admin would later approve it and deduct the balance.
                // For this simulation, we'll mark as pending and let admin handle it.
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
        await runTransaction(db, async (transaction) => {
            const packageDoc = await transaction.get(packageDocRef);
            const userDoc = await transaction.get(userDocRef);

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
                id: Date.now(), // Using timestamp for a unique ID in this simulation
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

            transaction.update(userDocRef, {
                'wallet.balance': increment(-pkg.price),
                investments: arrayUnion(newInvestment),
                transactions: arrayUnion(newTransaction),
            });
        });

        return { success: true };
    } catch (error) {
        console.error('Investment error:', error);
        if (error instanceof Error) {
            return { success: false, error: error.message };
        }
        return { success: false, error: 'An unknown error occurred during the investment process.' };
    }
}
