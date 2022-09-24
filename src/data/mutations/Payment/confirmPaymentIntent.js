import UserAccountType from '../../types/userAccountType';
import { payment } from '../../../config';
import stripePackage from 'stripe';
import { UserProfile, WalletHistory, currencyRates } from '../../models';

import {
    GraphQLString as StringType,
    GraphQLNonNull as NonNull,
    GraphQLBoolean as BooleanType,
    GraphQLFloat as FloatType
} from 'graphql';

import { convert } from '../../../helpers/currencyConvertion';
const stripe = stripePackage(payment.stripe.secretKey);

const confirmPaymentIntent = {

    type: UserAccountType,

    args: {
        paymentIntentId: { type: StringType },
        cardLastFour: { type: StringType },
        amount: { type: FloatType },
        currency: { type: StringType }
    },

    async resolve({ request }, { paymentIntentId, cardLastFour, amount, currency }) {
        if (request.user) {
            let userId = request.user.id, setupIntent, status = 200, transactionId;
            let requireAdditionalAction = false, paymentIntentSecret = '';
            let updatedWalletBalance = 0, ratesData ={};
            try {

                let confirmIntent = await stripe.paymentIntents.confirm(paymentIntentId);
                
                if (confirmIntent && confirmIntent.id && confirmIntent.status == 'succeeded') {
                    
                    const userData = await UserProfile.findOne({
                        attributes: ['userId', 'preferredCurrency', 'paymentCustomerId', 'walletBalance', 'walletUsed'],
                        where: {
                            userId
                        },
                        raw: true
                    });

                    transactionId = confirmIntent.id; 

                    const createWalletHistory = await WalletHistory.create({
                        userId,
                        transactionId,
                        cardLast4Digits: cardLastFour,
                        amount,
                        currency
                    });
                    
                    if (createWalletHistory) {
                        if (currency === userData.preferredCurrency) {
                            updatedWalletBalance = userData.walletBalance + amount;
                        } else {
                            const currencyRates = await CurrencyRates.findAll({ 
                                attributes: ['currencyCode', 'rate', 'isBase'],
                                raw: true 
                            });

                            const baseCurrency = currencyRates.find(o => o && o.isBase);

                            currencyRates.map((item) => { ratesData[item.currencyCode] = item.rate });

                            updatedWalletBalance = convert(
                                baseCurrency.currencyCode,
                                ratesData,
                                amount,
                                currency,
                                userData.preferredCurrency
                            );
                                
                            updatedWalletBalance = userData.walletBalance + updatedWalletBalance;
                        }

                        const updateWalletBalance = await UserProfile.update({
                            walletBalance: updatedWalletBalance
                        }, {
                            where: {
                                userId 
                            }
                        });
                    }
                    status = 200;
                } else if (confirmIntent && confirmIntent.id && confirmIntent.status == 'requires_action') {
                    status = 200;
                    requireAdditionalAction = true;
                    paymentIntentSecret = confirmIntent.client_secret;
                }
            } catch (error) {
                status = 400;
            }
            
            return await {
                status,
                errorMessage: '',
                requireAdditionalAction,
                paymentIntentSecret,
                walletBalance: updatedWalletBalance
            }


        } else {
            return {
                status: 500,
                errorMessage: 'You are not LoggedIn'
            }
        }

    },
};

export default confirmPaymentIntent;

/**
mutation confirmPaymentIntent($paymentIntentId: String, $cardLast4Digits: String, $paymentMethod: String) {
  confirmPaymentIntent(paymentIntentId: $paymentIntentId, cardLast4Digits: $cardLast4Digits, paymentMethod: $paymentMethod) {
    status
    errorMessage
  }
}
 */
