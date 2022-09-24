import UserAccountType from '../../types/userAccountType';
import { payment } from '../../../config';
import stripePackage from 'stripe';
import { UserProfile } from '../../models';

import {
    GraphQLString as StringType,
    GraphQLNonNull as NonNull,
    GraphQLBoolean as BooleanType,
} from 'graphql';

import { getCustomerId } from '../../../libs/payment/stripe/helpers/getCustomerId';
import { updateUserProfile } from '../../../libs/payment/stripe/helpers/updateUserProfile';

const stripe = stripePackage(payment.stripe.secretKey);

const confirmSetupIntent = {

    type: UserAccountType,

    args: {
        setupIntentId: { type: new NonNull(StringType) },
        cardLastFour: { type: new NonNull(StringType) },
        paymentMethod: { type: new NonNull(StringType) },
    },

    async resolve({ request }, { setupIntentId, cardLastFour, paymentMethod }) {

        if (request.user) {
            let userId = request.user.id, setupIntent, status = 200, customerId;
            let requireAdditionalAction = false, paymentIntentSecret = '', errorMessage = '';
            let getSetupIntent;

            try {
                customerId = await getCustomerId(userId); // Get Stripe customer ID
                
                getSetupIntent = await stripe.setupIntents.retrieve(setupIntentId); // Get the setup information existing info
                
                if (getSetupIntent && getSetupIntent.status === 'requires_action' && getSetupIntent.next_action) {
                    setupIntent = await stripe.setupIntents.confirm(setupIntentId, {
                        payment_method: paymentMethod
                    }); // Confirms the customer ID
                } else {
                    setupIntent = getSetupIntent;
                }
            } catch (error) {
                if (error.setup_intent) {
                    setupIntent = error.setup_intent;
                } else {
                    status = 400;
                    errorMessage = error.message || 'Something went wrong! Please try again.';
                }
            }
            
            if (setupIntent && setupIntent.status === 'requires_action') {
                status = 200;
                requireAdditionalAction = true;
                paymentIntentSecret = setupIntent.client_secret;
            }
            
            if (status === 200 && !requireAdditionalAction) {
                const attachCardToCustomer = await stripe.paymentMethods.attach(
                    setupIntent.payment_method, {
                      customer: customerId,
                    }
                );
                  
                await UserProfile.update({
                    paymentMethodId: paymentMethod,
                    cardLastFour,
                    preferredPaymentMethod: 2
                }, {
                    where: {
                        userId
                    }
                });
            }

            return await {
                status,
                errorMessage,
                requireAdditionalAction,
                paymentIntentSecret
            }


        } else {
            return {
                status: 500,
                errorMessage: 'You are not LoggedIn'
            }
        }



    },
};

export default confirmSetupIntent;

/**
mutation confirmSetupIntent($setupIntentId: String, $setupIntentStatus: Boolean, $paymentMethod: String) {
  confirmSetupIntent(setupIntentId: $setupIntentId, setupIntentStatus: $setupIntentStatus, paymentMethod: $paymentMethod) {
    status
    errorMessage
  }
}
 */
