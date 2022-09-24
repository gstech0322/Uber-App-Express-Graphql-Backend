import { Transaction } from '../../../../data/models';

export async function createTransaction(
    reservationId,
    payerEmail,
    payerId,
    transactionId,
    total,
    currency,
    paymentType,
    paymentMethodId
  ) {

    const transaction = await Transaction.findOrCreate({
        where: {
          reservationId,
          transactionId
        },
        defaults: {
          //properties you want on create
          reservationId,
          payerEmail,
          payerId,
          transactionId,
          total,
          currency,
          paymentType,
          paymentMethodId
        }
      });

    if(transaction) {
        return {
          status: 'created'
        };
    } else {
        return {
          status: 'failed to create transaction'
        }
    }
}