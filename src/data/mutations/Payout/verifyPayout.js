import GetPayoutType from '../../types/GetPayoutType';
import stripePackage from 'stripe';
import { payment, url } from '../../../config';

import {
    GraphQLString as StringType,
} from 'graphql';

const stripe = stripePackage(payment.stripe.secretKey, {
    apiVersion: '2019-12-03'
});

const verifyPayout = {

    type: GetPayoutType,

    args: {
        stripeAccount: { type: StringType }
    },

    async resolve({ request }, { stripeAccount }) {

        try {

            if (request.user) {
                let stripeAccountId = stripeAccount ? stripeAccount : null
                let status = 200, connectUrl;
                let successUrl = url + '/user/payout/success?account='  + stripeAccountId;
                let failureUrl = url + '/user/payout/failure?account='  + stripeAccountId;

                if (stripeAccountId != null) {
                    
                    const accountLinks = await stripe.accountLinks.create({
                        account: stripeAccountId,
                        failure_url: failureUrl,
                        success_url: successUrl,
                        type: 'custom_account_verification',
                        collect: 'currently_due', // currently_due or eventually_due
                    });

                    connectUrl = accountLinks.url; // Account links API on-boarding URL

                    return await {
                        status,
                        connectUrl,
                        successUrl,
                        failureUrl,
                        stripeAccountId
                    }
                }

            } else {

                return {
                    status: 500,
                    errorMessage: 'You haven\'t authorized for this action.',
                };
            }

        } catch(err) {
            return {
                status: 400,
                errorMessage: 'Something went wrong.' + err.message
            }
        }
        
    }
}

export default verifyPayout