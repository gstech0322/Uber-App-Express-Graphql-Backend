import { Reviews, User, UserProfile, Booking, BookingTips,CurrencyRates } from '../../models';
import GetReviewsType from '../../types/GetReviewsType';
import {
    GraphQLString as StringType,
    GraphQLFloat as FloatType,
    GraphQLInt as IntType,
    GraphQLNonNull as NonNull,
} from 'graphql';

import events from 'events';
var eventEmit = new events.EventEmitter();
import { sitename, payment } from '../../../config';

import stripePackage from 'stripe';
const stripe = stripePackage(payment.stripe.secretKey);
import { convert } from '../../../helpers/currencyConvertion';

import { sendNotifications } from '../../../helpers/push-notification/sendNotifications';

const WriteReviews = {

    type: GetReviewsType,

    args: {
        userId: { type: StringType },
        bookingId: { type: IntType },
        authorId: { type: StringType },
        ratings: { type: FloatType },
        reviewContent: { type: StringType },
        currency: { type: StringType },
        amount: { type: FloatType },
        paymentType: { type: IntType },
    },

    async resolve({ request }, { userId, bookingId, authorId, ratings, reviewContent,currency, amount, paymentType }) {
        try {
            let customer, transactionId, updatedWalletBalance = 0, walletAmount = 0, tipsAmount = 0;
            let status = 200, errorMessage, ratesData = {}, rates, tipsTotalFare = 0, stripePayment;
            
            if (request.user) {
                const userData = await UserProfile.findOne({
                    attributes: ['firstName', 'lastName', 'walletBalance', 'preferredCurrency', 'preferredLanguage', 'paymentCustomerId', 'firstName', 'lastName', 'paymentMethodId'],
                    where: {
                        userId: authorId,
                    },
                    raw: true
                });

                if (amount && amount > 0) {
                    if (paymentType === 3) {
                        walletAmount = userData.walletBalance;
                        if (walletAmount < amount) {
                            return await {
                                status: 400,
                                errorMessage: 'Sorry! Insufficient balance in your wallet.'
                            }
                        }
                    }
                    
                    let convertCurrency = userData.preferredCurrency;
                    tipsAmount = amount;

                    if (convertCurrency != currency) {
                        const data = await CurrencyRates.findAll({
                            attributes: ['currencyCode', 'rate', 'isBase'],
                            raw: true
                        });

                        const base = data.find(o => o && o.isBase);

                        data.map((item) => { ratesData[item.currencyCode] = item.rate });

                        rates = ratesData;
                        tipsAmount = convert(base.currencyCode, rates, amount, currency, convertCurrency);
                    }

                    if (paymentType === 2 && tipsAmount > 0) { // Card Payment - Stripe
                        try {
                            let riderName = userData.firstName + ' ' + userData.lastName;
                            customer = userData && userData.paymentCustomerId;
                            
                            if (userData && userData.paymentMethodId) { // Fetch paymentMethodId from the UserProfile table
                                let paymentMethod = await stripe.paymentMethods.retrieve(userData.paymentMethodId);
                                
                                if (paymentMethod) {
                                    stripePayment = await stripe.paymentIntents.create({
                                        amount: Math.round(tipsAmount * 100),
                                        currency,
                                        confirm: true,
                                        off_session: true,
                                        payment_method: paymentMethod.id,
                                        customer,
                                        use_stripe_sdk: true
                                    });

                                    if (stripePayment && stripePayment.status === 'requires_source_action' 
                                        && stripePayment.next_action && stripePayment.next_action.type === 'use_stripe_sdk') {
                                        status = 400;
                                        errorMessage = "Oops! your card requires authentication. Please update your saved card.";
                                    } else if (stripePayment && stripePayment.status === 'succeeded') {
                                        transactionId = stripePayment.id;
                                    } else {
                                        status = 400;
                                        errorMessage = 'Oops! something went wrong and unable to process the transaction';
                                    }
                                } else {
                                    status = 400;
                                    errorMessage = 'Oops! something went wrong and unable to process the transaction with your saved card.';
                                }
                            } else {
                                status = 400;
                                errorMessage = "Oops! something went wrong. Please update your saved card. 1";
                            }
                        } catch(error) {
                            status = 400;
                            errorMessage = "Oops! something went wrong. Please update your saved card. 2";
                        }
                    } else if (paymentType === 3) { // Wallet
                        updatedWalletBalance = parseFloat(walletAmount - tipsAmount);
                        const balanceUpdate = await UserProfile.update({
                            walletBalance: updatedWalletBalance
                        }, {
                            where: {
                                userId: authorId
                            }
                        });
                    } else {
                        status = 400;
                    }

                    if (status === 200) {
                        const bookingData = await Booking.findOne({
                            attributes: ['driverId', 'isSpecialTrip', 'specialTripTotalFare', 'riderTotalFare', 'driverTotalFare'],
                            where: {
                                id: bookingId
                            },
                            raw: true
                        });

                        const createReviews = await Reviews.create({
                            userId,
                            bookingId,
                            authorId,
                            ratings,
                            reviewContent
                        });

                        const createTip = await BookingTips.create({
                            bookingId,
                            riderId: authorId,
                            driverId: bookingData.driverId,
                            amount: tipsAmount,
                            riderCurrency: currency,
                            driverCurrency: convertCurrency,
                            paymentType,
                            transactionId
                        });
                        
                        if((bookingData) && (bookingData.isSpecialTrip === true || bookingData.isSpecialTrip === 1)) {
                            tipsTotalFare = parseFloat(bookingData.specialTripTotalFare + tipsAmount);
                        } else {
                            tipsTotalFare = parseFloat(bookingData.riderTotalFare + tipsAmount);
                        }

                        let tipsDriverTotalFare = parseFloat(bookingData.driverTotalFare + tipsAmount);

                        let updateBookingData = await Booking.update({
                            isTipGiven: true, 
                            tipsAmount,
                            tipsTotalFare,
                            tipsDriverTotalFare
                        }, {
                            where: {
                                id: bookingId
                            }
                        });
                        
                        let tipId = createTip.dataValues.id;

                        eventEmit.emit('reviewAverage', { userId, bookingId, tipsAmount }, function (data) { });

                        const receiverProfileData = await UserProfile.findOne({
                            attributes: ['userId', 'preferredLanguage'],
                            where: {
                                userId
                            },
                            raw: true
                        });

                        let pushNotificationContent = {
                            tripStatus: 'tipsReceived',
                            name: userData['firstName'] + ' ' + userData['lastName'],
                            bookingId,
                            currency: convertCurrency,
                            amount: Number(tipsAmount)
                        };

                        let requestLang = receiverProfileData && receiverProfileData.preferredLanguage;

                        await sendNotifications('tipsReceived', pushNotificationContent, userId, requestLang);

                        return await {
                            status,
                            errorMessage,
                            results: {
                                id: tipId,
                                riderId: authorId,
                                driverId: bookingData.driverId,
                                bookingId,
                                paymentType,
                            }
                        };
                    } else {
                        return await {
                            status: 400,
                            errorMessage
                        }
                    }
                } else {
                    const createAReview = await Reviews.create({
                        userId,
                        bookingId,
                        authorId,
                        ratings,
                        reviewContent
                    });

                    eventEmit.emit('reviewAverage', { userId, bookingId }, function (data) { });

                    if (createAReview) {
                        return await {
                            status: 200
                        };
                    } else {
                        return await {
                            status: 400,
                            errorMessage: 'Oops! something went wrong! Please try again.',
                        };
                    }
                }
            } else {
                return {
                    status: 500,
                    errorMessage: 'Oops! It looks like you are not logged-in with your account. Please login with your account and try again.'
                }
            }
        } catch (error) {
            return {
                errorMessage: 'Something went wrong ' + error,
                status: 400
            };
        }
    }
};

export default WriteReviews;

eventEmit.on('reviewAverage', async function (data,done) {

    let overallRating = 0;

    const reviewsData = await Reviews.findAll({
        attributes: ['userId', 'ratings'],
        where: {
            userId: data.userId
        },
        raw: true
    });

    const totalReviews = reviewsData.length;

    const ratingsArray = reviewsData.map(x => { return Number(x['ratings']) });

    if (totalReviews > 0) {
        overallRating = ratingsArray.reduce((total, currentValue) => { return total + currentValue });
        overallRating = overallRating / totalReviews;
        
        let userOverallRatingUpdate = await User.update({
            overallRating
        }, {
            where: {
                id: data.userId
            }
        })
    }
   
    done();
});

/**
mutation WriteReviews(
  $userId:String,
  $bookingId:Int,
  $authorId:String,
  $ratings:Float,
  $reviewContent:String,
) {
  WriteReviews(
    userId:$userId,
    bookingId:$bookingId,
    authorId:$authorId,
    ratings:$ratings,
    reviewContent:$reviewContent,
  ) {
   status
  }
}

 */
