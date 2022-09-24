import UserAccountType from '../../types/userAccountType';
import { payment } from '../../../config';
import stripePackage from 'stripe';

import { UserProfile } from '../../models';

import { getCustomerId, getCustomerSource } from '../../../libs/payment/stripe/helpers/getCustomerId';

const stripe = stripePackage(payment.stripe.secretKey);

const removeCardDetails = {

    type: UserAccountType,

    async resolve({ request }) {
        try {
            if (request.user) {
                let userId = request.user.id, customerId;
                let status = 200, errorMessage, removePaymentMethod;

                customerId = await getCustomerId(userId);

                let userData = await UserProfile.findOne({
                    attributes: ['paymentMethodId'],
                    where: {
                        userId
                    },
                    raw: true
                });

                if (customerId) {
                    try {
                        if (userData && userData.paymentMethodId) {
                            removePaymentMethod = await stripe.paymentMethods.detach(userData.paymentMethodId);
                        }
                        
                        let updateUserProfile = await UserProfile.update({
                            paymentMethodId: null,
                            cardLastFour: null
                        }, {
                            where: {
                                userId
                            }
                        });
                    } catch (error) {
                        status = 400;
                        errorMessage = error.message;
                    }
                } else {
                    status = 400;
                    errorMessage = 'Something went wrong. Please try again later.'
                }

                return await {
                    status,
                    errorMessage
                }
            } else {
                return {
                    status: 500,
                    errorMessage: 'You are not LoggedIn'
                }
            }

        } catch (error) {
            return {
                errorMessage: 'Something went wrong ' + error,
                status: 400
            };
        }

    },
};

export default removeCardDetails;

/**
mutation removeCardDetails {
  removeCardDetails {
    status
    errorMessage
  }
}
 */
