import { TransactionHistory } from '../../../../data/models';

export async function createTransactionHistory(
    reservationId, 
    hostEmail, 
    payoutId, 
    transactionId,
    amount, 
    currency,
    userId,
    paymentMethodId
  ) {
      const transactions = await TransactionHistory.create({
        reservationId, 
        payoutId,
        payoutEmail: hostEmail, 
        transactionId,
        amount, 
        currency,
        userId,
        paymentMethodId
      });
}