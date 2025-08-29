
'use server';

import { doc, updateDoc, getDoc, arrayUnion, increment, runTransaction } from 'firebase/firestore';
import { db } from './firebase';
import type { User, Transaction, Investment } from './types';
import { packages } from './data';
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
            const newTransactionData = {
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
                // For this simulation, we'll deduct it immediately for the user to see the change.
                transaction.update(userDocRef, {
                    'wallet.balance': increment(-totalDeduction),
                    'wallet.totalWithdrawal': increment(amount),
                    transactions: arrayUnion(newTransactionData),
                });

            } else { // Deposit
                // Similarly, deposits would need verification. For simulation, we add it directly.
                 transaction.update(userDocRef, {
                    'wallet.balance': increment(amount),
                    'wallet.totalRecharge': increment(amount),
                    transactions: arrayUnion(newTransactionData),
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
    packageId: number;
}

export async function handleInvestment(params: HandleInvestmentParams): Promise<{ success: boolean; error?: string }> {
    const { userId, packageId } = params;

    if (!userId) {
        return { success: false, error: 'User is not authenticated.' };
    }

    const pkg = packages.find(p => p.id === packageId);
    if (!pkg) {
        return { success: false, error: 'Invalid package selected.' };
    }

    const userDocRef = doc(db, 'users', userId);

    try {
        await runTransaction(db, async (transaction) => {
            const userDoc = await transaction.get(userDocRef);
            if (!userDoc.exists()) {
                throw new Error("User not found.");
            }

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
