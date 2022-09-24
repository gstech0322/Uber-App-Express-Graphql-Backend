import {
    Booking, BookingHistory, User, UserProfile, BookingPromoCode,
    CurrencyRates, Pricing
} from '../../models';
import BookingRequestType from '../../types/BookingRequestType';

import {
    GraphQLFloat as FloatType,
    GraphQLNonNull as NonNull,
    GraphQLInt as IntType,
    GraphQLString as StringType
} from 'graphql';

import {getCustomerId} from '../../../libs/payment/stripe/helpers/getCustomerId';
import calculateTripCalculation from '../../../libs/calculateTripCalculation';
import {getMinutes} from '../../../helpers/timeHelpers';

import {sendNotifications} from '../../../helpers/push-notification/sendNotifications';

import stripePackage from 'stripe';
import {payment} from '../../../config';

const stripe = stripePackage(payment.stripe.secretKey);
import {convert} from '../../../helpers/currencyConvertion';

const completeBooking = {

    type: BookingRequestType,

    args: {
        bookingId: {type: new NonNull(IntType)},
        totalDistance: {type: new NonNull(FloatType)},
        dropOffLocation: {type: new NonNull(StringType)},
        dropOffLat: {type: new NonNull(FloatType)},
        dropOffLng: {type: new NonNull(FloatType)},
        tollFee: {type: FloatType},
    },

    async resolve({request}, {bookingId, totalDistance, dropOffLocation, dropOffLat, dropOffLng, tollFee}) {
        let pushNotificationContent, riderPayableFare = 0, tollAmount = 0, rates = {}, baseCurrency;
        let paymentType, paymentProcessed = false, transactionId = null;
        let customerId, errorMessage;
        let stripePayment, paymentStatus = 'pending', notes, walletBalance, walletUsed;
        let promoCodeData, isSpecialTrip, specialTripPrice, specialTripTotalFare, requestLang;
        let totalDuration, calculation, driverConvertCurrency, driverCalculation;

        // Geo-Fencing
        let pricingAttributes = [
            'id', 'categoryId', 'unitPrice', 'minutePrice', 'basePrice', 'currency', 'riderFeeType',
            'riderFeeValue', 'driverFeeType', 'driverFeeValue', 'isActive', 'isSurgePrice'
        ];


        try {
            // Booking Data
            const bookingData = await Booking.findOne({
                attributes: [
                    'riderId', 'driverId', 'tripStatus', 'isSpecialTrip', 'promoCodeId',
                    'tripStart', 'vehicleType', 'vehicleModel', 'vehicleColor', 'paymentType', 'pickUpLocation', 'estimatedTotalFare', 'currency',
                    'pricingId'
                ],
                where: {
                    id: bookingId
                },
                raw: true
            });

            // Rider Data
            const profileData = await UserProfile.findOne({
                attributes: ['userId', 'preferredCurrency', 'preferredLanguage', 'firstName', 'lastName', 'picture', 'paymentCustomerId', 'walletBalance', 'walletUsed', 'paymentMethodId'],
                where: {
                    userId: bookingData.riderId
                },
                raw: true
            });

            walletBalance = profileData.walletBalance && profileData.walletBalance ? parseFloat(profileData.walletBalance) : 0;
            walletUsed = profileData && profileData.walletUsed ? parseFloat(profileData.walletUsed) : 0;

            // Driver Data
            const driverData = await UserProfile.findOne({
                attributes: ['userId', 'preferredCurrency', 'preferredLanguage', 'firstName', 'lastName', 'picture'],
                where: {
                    userId: bookingData.driverId
                },
                raw: true
            });

            if (bookingData && profileData) {
                if (bookingData.tripStatus === 'started') {
                    let convertCurrency = profileData && profileData.preferredCurrency;
                    // Promo code calculation for trip complete
                    if (bookingData && bookingData.isSpecialTrip && bookingData.promoCodeId) {
                        promoCodeData = await BookingPromoCode.findOne({
                            where: {
                                bookingId
                            },
                            raw: true
                        });
                    }

                    // Find the pricing for the trip which is already assigned
                    const pricingInfo = await Pricing.findOne({
                        attributes: pricingAttributes,
                        where: {
                            isActive: true,
                            id: bookingData.pricingId
                        },
                        order: [['updatedAt', 'DESC']],
                        raw: true
                    });

                    // Currency Rates & information
                    const currencyRatesData = await CurrencyRates.findAll({
                        attributes: ['currencyCode', 'rate', 'isBase'],
                        raw: true
                    });

                    baseCurrency = currencyRatesData.find(o => o && o.isBase);
                    baseCurrency = baseCurrency.currencyCode;
                    currencyRatesData.map((item) => {
                        rates[item.currencyCode] = item.rate
                    });

                    totalDuration = getMinutes(new Date(bookingData.tripStart), new Date());
                    calculation = await calculateTripCalculation(pricingInfo, null, totalDistance, totalDuration, convertCurrency, promoCodeData, rates, baseCurrency);

                    driverConvertCurrency = driverData && driverData.preferredCurrency;
                    driverCalculation = await calculateTripCalculation(pricingInfo, null, totalDistance, totalDuration, driverConvertCurrency, promoCodeData, rates, baseCurrency);

                    paymentType = bookingData.paymentType;

                    // Promo code
                    isSpecialTrip = calculation.isSpecialTrip;
                    specialTripPrice = calculation.specialTripPrice;
                    specialTripTotalFare = calculation.specialTripTotalFare;

                    riderPayableFare = calculation.riderPayableFare

                    if (tollFee && tollFee > 0) {
                        tollAmount = tollFee; // Toll fee

                        if (driverConvertCurrency != bookingData.currency) {
                            tollAmount = convert(baseCurrency, rates, tollAmount, driverConvertCurrency, bookingData.currency);
                        }
                    }

                    let riderTotalFare = calculation.totalFareForRider;
                    let driverTotalFare = calculation.totalFareForDriver;

                    if (tollAmount > 0) {
                        riderTotalFare = parseFloat(calculation.totalFareForRider) + parseFloat(tollAmount);
                        driverTotalFare = parseFloat(calculation.totalFareForDriver) + parseFloat(tollAmount);

                        if ((bookingData) && (bookingData.isSpecialTrip === true || bookingData.isSpecialTrip === 1)) {
                            specialTripTotalFare = parseFloat(specialTripTotalFare) + parseFloat(tollAmount);
                        }

                        riderPayableFare = parseFloat(riderPayableFare) + parseFloat(tollAmount);
                    }

                    if (paymentType === 1) { // Cash
                        paymentProcessed = true;
                        paymentStatus = 'completed';
                    } else if (paymentType === 2) { // Card - Stripe
                        customerId = await getCustomerId(bookingData.riderId); // Stripe Customer ID

                        if (profileData && profileData.paymentMethodId) { // Fetch paymentMethodId from the UserProfile table
                            let paymentMethod = await stripe.paymentMethods.retrieve(profileData.paymentMethodId);

                            if (paymentMethod) {
                                try {
                                    stripePayment = await stripe.paymentIntents.create({
                                        amount: Math.round(riderPayableFare * 100),
                                        currency: convertCurrency,
                                        confirm: true,
                                        off_session: true,
                                        payment_method: paymentMethod.id,
                                        customer: customerId,
                                        use_stripe_sdk: true,
                                        confirmation_method: 'manual'
                                    });

                                    if (stripePayment && stripePayment.status === 'requires_source_action'
                                        && stripePayment.next_action && stripePayment.next_action.type === 'use_stripe_sdk') {
                                        paymentType = 1;
                                        paymentProcessed = true;
                                        notes = "The problem occurs with the saved card, it requires the authentication and payment type changed to Cash.";
                                    } else if (stripePayment && stripePayment.status === 'succeeded') {
                                        paymentProcessed = true; // Stripe Payment success
                                        transactionId = stripePayment.id;
                                    } else {
                                        paymentType = 1;
                                        paymentProcessed = true;
                                        errorMessage = 'Something went wrong with the saved card. We switched the payment type to Cash.';
                                    }
                                } catch (error) {
                                    paymentType = 1;
                                    paymentProcessed = true;
                                    notes = "The problem occurs with the saved card, it requires the authentication and payment type changed to Cash." + error.message;
                                }
                            } else {
                                paymentType = 1;
                                paymentProcessed = true;
                                notes = "Unable to find the payment method ID from the Stripe for the saved card and payment type changed to Cash.";
                            }
                        } else {
                            paymentType = 1;
                            paymentProcessed = true;
                            notes = "No payment method ID for the rider and payment type changed to Cash.";
                        }
                        paymentStatus = 'completed';
                    } else { // Wallet
                        if (profileData && profileData.walletBalance > 0 && calculation
                            && parseFloat(profileData.walletBalance) >= parseFloat(riderPayableFare)) { // Having enough balance in wallet

                            paymentType = 3;
                            paymentStatus = 'completed';
                            paymentProcessed = true;
                            walletBalance = parseFloat(walletBalance) - parseFloat(riderPayableFare);
                            walletUsed = parseFloat(walletUsed) + parseFloat(riderPayableFare);

                        } else { // Not having enough balance in wallet

                            paymentType = 1;
                            paymentStatus = 'completed';
                            notes = "Wallet doesn't have enough balance and payment type changed to Cash.";
                            paymentProcessed = true;
                        }
                    }

                    if (paymentProcessed) {
                        const bookingUpdate = await Booking.update({
                            dropOffLocation,
                            dropOffLat,
                            dropOffLng,
                            totalRideDistance: totalDistance,
                            tripStatus: 'completed',
                            baseFare: calculation.basePrice, // Min base fare
                            baseUnit: calculation.unitPrice, // Price per unit
                            baseMinute: calculation.minutePrice,
                            riderServiceFee: calculation.riderServiceFee,
                            driverServiceFee: calculation.driverServiceFee,
                            totalFare: calculation.totalFare, // with rider service fee
                            totalDuration,
                            endDate: new Date(),
                            endTime: new Date(),
                            tripEnd: new Date(),
                            currency: convertCurrency,
                            riderTotalFare,
                            driverTotalFare,
                            paymentStatus,
                            transactionId,
                            notes,
                            paymentType,
                            isSpecialTrip,
                            specialTripPrice,
                            specialTripTotalFare,
                            tollFee: tollAmount,
                            riderPayableFare
                        }, {
                            where: {
                                id: bookingId
                            }
                        });

                        if (paymentType === 3) { // If wallet payment processed successfully
                            const updateUserWalletPrice = await UserProfile.update({
                                walletBalance,
                                walletUsed
                            }, {
                                where: {
                                    userId: bookingData.riderId
                                }
                            });
                        }

                        const driverStatusUpdate = await User.update({
                            activeStatus: 'active'
                        }, {
                            where: {
                                id: bookingData.driverId,
                            }
                        });

                        const bookingHistoryUpdate = await BookingHistory.update({
                            status: 3
                        }, {
                            where: {
                                bookingId,
                                driverId: bookingData.driverId
                            }
                        });

                        // Push Notification to Rider
                        requestLang = profileData && profileData['preferredLanguage'];

                        pushNotificationContent = {
                            tripStatus: 'tripComplete',
                            name: driverData['firstName'] + ' ' + driverData['lastName'],
                            bookingId,
                            driverId: bookingData.driverId,
                            picture: driverData['picture'],
                            pickUpLocation: bookingData.pickUpLocation,
                            dropOffLocation,
                            riderServiceFee: Number(calculation.riderServiceFee),
                            driverServiceFee: Number(calculation.driverServiceFee),
                            estimatedTotalFare: Number(bookingData.estimatedTotalFare),
                            totalFare: Number(calculation.totalFare),
                            riderTotalFare: Number(riderTotalFare),
                            driverTotalFare: Number(driverTotalFare),
                            totalDuration,
                            totalRideDistance: totalDistance,
                            currency: convertCurrency,
                            paymentType,
                            isSpecialTrip,
                            specialTripPrice,
                            specialTripTotalFare,
                            amount: Number(riderPayableFare)
                        };

                        await sendNotifications('tripComplete', pushNotificationContent, bookingData.riderId, requestLang);

                        // Push Notification to Driver
                        requestLang = driverData && driverData['preferredLanguage'];

                        pushNotificationContent = {
                            tripStatus: 'paymentSuccess',
                            name: profileData['firstName'] + ' ' + profileData['lastName'],
                            bookingId,
                            riderId: bookingData.riderId,
                            picture: profileData['picture'],
                            pickUpLocation: bookingData.pickUpLocation,
                            dropOffLocation,
                            riderServiceFee: Number(driverCalculation.riderServiceFee),
                            driverServiceFee: Number(driverCalculation.driverServiceFee),
                            estimatedTotalFare: Number(driverCalculation.estimatedTotalFare),
                            totalFare: Number(driverCalculation.totalFare),
                            riderTotalFare: Number(riderTotalFare),
                            driverTotalFare: Number(driverCalculation.totalFareForDriver),
                            totalDuration,
                            totalRideDistance: totalDistance,
                            currency: driverConvertCurrency,
                            paymentType,
                            amount: (paymentType === 1 ? Number(riderPayableFare) : Number(driverCalculation.totalFareForDriver))
                        };

                        await sendNotifications('paymentSuccess', pushNotificationContent, bookingData.driverId, requestLang);

                        return await {
                            status: 200,
                            data: {
                                id: bookingData.riderId,
                                riderId: bookingData.riderId,
                                driverId: bookingData.driverId,
                                baseUnit: calculation.unitPrice,
                                baseMinute: calculation.minutePrice,
                                baseFare: calculation.basePrice,
                                riderServiceFee: calculation.riderServiceFee,
                                driverServiceFee: calculation.driverServiceFee,
                                estimatedTotalFare: bookingData.estimatedTotalFare,
                                totalFare: calculation.totalFare,
                                riderTotalFare,
                                driverTotalFare,
                                totalDuration,
                                totalRideDistance: totalDistance,
                                currency: convertCurrency,
                                paymentType,
                                walletBalance,
                                isSpecialTrip,
                                specialTripPrice,
                                specialTripTotalFare,
                                tollFee: tollAmount
                            }
                        };
                    } else {
                        return await {
                            status: 400,
                            errorMessage: 'Oops, something went wrong!',
                            data: {
                                tripStatus: bookingData.tripStatus
                            }
                        };
                    }
                } else {
                    if (bookingData.tripStatus === 'completed') {
                        errorMessage = 'Oops! it looks like you have already completed this trip. Please close your application and try again.';
                    } else if (bookingData.tripStatus === 'cancelledByRider') {
                        errorMessage = 'Oops! it looks like the rider has already cancelled this trip. Please close your application and try again.';
                    } else if (bookingData.tripStatus === 'cancelledByDriver') {
                        errorMessage = 'Oops! it looks like you have already cancelled this trip. Please close your application and try again.';
                    } else {
                        errorMessage = 'Oops! something went wrong. Please try again.';
                    }

                    return await {
                        status: 400,
                        errorMessage,
                        data: {
                            tripStatus: bookingData.tripStatus
                        }
                    };
                }
            } else {
                return {
                    errorMessage: 'Oops! something went wrong. Please try again.',
                    status: 400
                };
            }
        } catch (error) {
            return {
                errorMessage: 'Something went wrong' + error,
                status: 400
            };
        }
    }
};

export default completeBooking;

/*

mutation($bookingId: Int!, $totalDistance: Float!, $dropOffLocation: String!, $dropOffLat: Float!, $dropOffLng: Float!) {
    completeBooking(bookingId: $bookingId, totalDistance: $totalDistance, dropOffLocation: $dropOffLocation, dropOffLat: $dropOffLat, dropOffLng: $dropOffLng) {
        status
        errorMessage
        data {
            id
            riderId
            driverId
            baseUnit
            baseMinute
            baseFare
            riderServiceFee
            driverServiceFee
            estimatedTotalFare
            totalFare
            riderTotalFare
            driverTotalFare
            totalDuration
            totalRideDistance
            currency
            paymentType
            walletBalance
            isSpecialTrip
            specialTripPrice
            specialTripTotalFare
        }
    }
}

*/