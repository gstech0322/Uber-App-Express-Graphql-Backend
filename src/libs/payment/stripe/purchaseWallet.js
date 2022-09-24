
import stripePackage from 'stripe';
import { payment, sitename } from '../../../config';
const stripe = stripePackage(payment.stripe.secretKey);

import { updateCustomerId } from './helpers/getCustomerId';

export async function purchaseWalletStripe(
    amount, 
    currency, 
    cardToken,
    customer,
    userId,
    email
) {
    let status = 200, errorMessage, transactionId, cardLast4Digits, customerId, sourceId, charge, source;

    try {
        if (!customer) { // Create stripe customer for the very first time(if the rider didn't connect with Stripe earlier)
            const createCustomer = await stripe.customers.create({ email });

            if ('id' in createCustomer) {
                customerId = createCustomer.id;
                await updateCustomerId(userId, customerId);
            }
        } else {
            customerId = customer;
        }

        charge = await stripe.charges.create({
            amount: Math.round(amount * 100),
            currency,
            source: cardToken,
            metadata: {
                userId,
                title: sitename + ' wallet# ' + amount + currency + ' userID:' + userId
            },
            description: sitename + ' wallet:- amount: ' + amount + ', currency: ' + currency
        });
    } catch(error) {
        status = 400;
        errorMessage = error.message;
    }

    if(status === 200 && charge && 'id' in charge) {
        transactionId = charge.id;
        cardLast4Digits = charge.payment_method_details && charge.payment_method_details.card && charge.payment_method_details.card.last4
    }

    return await {
        status,
        errorMessage,
        transactionId,
        cardLast4Digits,
        customerId
    };
}