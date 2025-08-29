
'use server';

import { doc, updateDoc, getDoc, arrayUnion, increment } from 'firebase/firestore';
import { db } from './firebase';
import type { User, Transaction } from './types';

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
        const userDoc = await getDoc(userDocRef);
        if (!userDoc.exists()) {
            return { success: false, error: 'User not found.' };
        }

        const user = userDoc.data() as User;

        const newTransaction: Omit<Transaction, 'id'> = {
            userId: user.id, // This should be the firestore ID, not auth UID if they differ
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
                return { success: false, error: 'Insufficient balance to cover withdrawal and fee.' };
            }
            // For withdrawals, we just create the pending transaction.
            // An admin would later approve it and deduct the balance.
            // For this simulation, we'll deduct it immediately for the user to see the change.
             await updateDoc(userDocRef, {
                'wallet.balance': increment(-totalDeduction),
                'wallet.totalWithdrawal': increment(amount),
                transactions: arrayUnion(newTransaction),
            });

        } else { // Deposit
            // Similarly, deposits would need verification. For simulation, we add it directly.
            await updateDoc(userDocRef, {
                'wallet.balance': increment(amount),
                'wallet.totalRecharge': increment(amount),
                transactions: arrayUnion(newTransaction),
            });
        }
        
        return { success: true };

    } catch (error) {
        console.error('Transaction error:', error);
        if (error instanceof Error) {
            return { success: false, error: error.message };
        }
        return { success: false, error: 'An unknown error occurred.' };
    }
}
