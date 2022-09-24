import { User, UserProfile, WalletHistory, CurrencyRates } from '../../models';

import WalletHistoryType from '../../types/WalletHistoryType';

import {
    GraphQLString as StringType,
    GraphQLNonNull as NonNull,
    GraphQLFloat as FloatType,
    GraphQLBoolean as BooleanType,
} from 'graphql';


import { convert } from '../../../helpers/currencyConvertion';

import stripePackage from 'stripe';
import { payment } from '../../../config';
const stripe = stripePackage(payment.stripe.secretKey);

const addWallet = {

    type: WalletHistoryType,

    args: {
        amount: { type: new NonNull(FloatType) },
        currency: { type: new NonNull(StringType) },
        paymentMethod: { type: new NonNull(StringType) },
        payment: { type: BooleanType },
    },

    async resolve({ request }, {
        amount,
        currency,
        paymentMethod
    }) {
        try {

            if (request.user) {

                let userId = request.user.id, customer, updatedWalletBalance = 0;
                let ratesData = {}, status = 400, errorMessage;
                let requireAdditionalAction = false, paymentIntentSecret = '', customerDetails;
                let cardLast4Digits;

                const userData = await User.findOne({
                    attributes: ['id', 'isBan', 'email'],
                    where: {
                        id: userId,
                        deletedAt: null
                    },
                    include: [
                        {
                            model: UserProfile,
                            as: 'profile',
                            required: true,
                            where: {
                                userId
                            },
                            attributes: ['preferredCurrency', 'paymentCustomerId', 'walletBalance']
                        }
                    ],
                    raw: true
                });

                if (userData && userData.isBan) {
                    return await {
                        status: 500,
                        errorMessage: 'Oops! it looks like your account has been blocked. Please contact support.',
                    };
                } else if (userData) {

                    customer = userData['profile.paymentCustomerId'];

                    let intent = await stripe.paymentIntents.create({
                        payment_method: paymentMethod,
                        amount: Math.round(amount * 100),
                        currency: currency,
                        payment_method_types: ['card'],
                        confirmation_method: 'manual',
                        confirm: true,
                        //customer: customer
                    });

                    if (intent && (intent.status === 'requires_action' || intent.status === 'requires_source_action') && intent.next_action.type === 'use_stripe_sdk') {
                        
                        //3d secure auth card, next step confirmPaymentIntent
                        requireAdditionalAction = true;
                        paymentIntentSecret = intent.client_secret;

                        return await {
                            status: 200,
                            requireAdditionalAction,
                            paymentIntentSecret
                        };

                    } else if (intent && intent.status === 'succeeded') {
                        status = 200;
                    } else {
                        status = 400;
                        errorMessage = 'Sorry, something went wrong with your card. Please try again.';
                    }

                    if (status === 200 && intent && 'id' in intent) {

                        const createWalletHistory = await WalletHistory.create({
                            userId,
                            transactionId: intent.id,
                            cardLast4Digits,
                            amount,
                            currency
                        });

                        if (createWalletHistory) {

                            if (currency === userData['profile.preferredCurrency']) {

                                updatedWalletBalance = userData['profile.walletBalance'] + amount;

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
                                    userData['profile.preferredCurrency']
                                );

                                updatedWalletBalance = userData['profile.walletBalance'] + updatedWalletBalance;
                            }

                            const updateWalletBalance = await UserProfile.update({
                                walletBalance: updatedWalletBalance
                            }, {
                                where: {
                                    userId
                                }
                            });

                            if (updateWalletBalance) {
                                return await {
                                    status: 200,
                                    walletBalance: updatedWalletBalance && updatedWalletBalance.toFixed(2)
                                };
                            } else {
                                return await {
                                    status: 400,
                                    errorMessage: 'Oops! something went wrong. Please our contact support team.'
                                };
                            }
                        } else {
                            return await {
                                status: 400,
                                errorMessage: 'Oops! something went wrong. Please our contact support team.'
                            };
                        }
                    } else {
                        return await {
                            status: status || 400,
                            errorMessage: errorMessage || 'Oops! Something went wrong. please try again.'

                        };
                    }
                } else {
                    return {
                        status: 500,
                        errorMessage: 'Oops! it looks like you are not logged-in with your account. Please login to continue.',
                    };
                }
            } else {
                return {
                    status: 500,
                    errorMessage: 'Oops! it looks like you are not logged-in with your account. Please login to continue.',
                };
            }
        } catch (error) {
            return {
                status: 400,
                errorMessage: 'Something went wrong.' + error.message

            }
        }
    },
};

export default addWallet;

/*

mutation($amount: Float!, $currency: String!, $token: String!) {
    addWallet(amount: $amount, currency: $currency, token: $token) {
        walletBalance
        status
        errorMessage
    }
}

*/
