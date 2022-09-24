
import stripePackage from 'stripe';
import { payment, sitename } from '../../../config';
const stripe = stripePackage(payment.stripe.secretKey);

export async function processStripePayment(
    riderId, 
    driverId,
    amount, 
    currency, 
    customer, 
    bookingId, 
    riderName,
    driverName
) {
    let status = 200, errorMessage, transactionId, charge;

    try {
        charge = await stripe.charges.create({
            amount: Math.round(amount * 100),
            currency,
            customer,
            metadata: {
                bookingId,
                driverId,
                riderId,
                title: sitename + ' booking#' + bookingId
            },
            description: 'Booking: #' + bookingId + ', Rider: ' + riderName + ', Driver: ' + driverName
        });
    } catch(error) {
        status = 400;
        errorMessage = error.message;
    }

    if(status === 200 && charge && 'id' in charge) {
        transactionId = charge.id;
    }

    return await {
        status,
        errorMessage,
        transactionId
    };
}