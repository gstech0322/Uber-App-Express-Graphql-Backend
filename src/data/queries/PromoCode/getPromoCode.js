import {
    GraphQLString as StringType
} from 'graphql';

import sequelize from '../../sequelize';
import { PromoCode } from '../../models';

import PromoCodeCommonType from '../../types/PromoCodeCommonType';

import { convert } from '../../../helpers/currencyConvertion';
import getCurrencyRates from '../../../helpers/currencyRatesHelper';

const getPromoCode = {

    type: PromoCodeCommonType,

    args: {
        requestCategories: { type: StringType },
        currency: { type: StringType },
        scheduledFrom: { type: StringType }
    },

    async resolve({ request }, { requestCategories, currency, scheduledFrom }) {
        try {
            if (request.user) {

                let result = [];
                let userId = request.user.id;
                let expDate = scheduledFrom === undefined ? new Date() : new Date(Number(scheduledFrom)).toJSON().split("T")[0]


                const promoCodeData = await PromoCode.findAll({
                    where: {
                        $and: [
                            { isEnable: true },
                            {
                                expiryDate: {
                                    $or: [{
                                        $gte: expDate
                                    }, {
                                        $eq: null
                                    }]
                                }
                            },
                            {
                                id: {
                                    $notIn: [
                                        sequelize.literal(`SELECT promoCodeId FROM Booking WHERE riderId="${userId}" AND isSpecialTrip=1`)
                                    ]
                                }
                            }
                        ]
                    },
                    raw: true
                });

                if (promoCodeData && promoCodeData.length > 0 && requestCategories && currency) {
                    let categoryDetails = JSON.parse(requestCategories)
                    const { rates, baseCurrency } = await getCurrencyRates();

                    //Compare Promocode price and Booking Fare
                    promoCodeData.map((promo) => {
                        let promoPrice;
                        let availableCategories = [];
                        categoryDetails.map((category) => {
                            if (promo.type === 1) {
                                availableCategories.push(category.categoryId)
                            } else if (promo.type === 2) {
                                let bookingFare = category.bookingFare
                                if (promo.currency && promo.currency !== currency) {
                                    promoPrice = convert(baseCurrency, rates, promo.promoValue, promo.currency, currency)
                                    if (bookingFare > promoPrice) {
                                        availableCategories.push(category.categoryId)
                                    }
                                } else {
                                    if (bookingFare > promo.promoValue) {
                                        availableCategories.push(category.categoryId)
                                    }
                                }
                            }
                        })

                        result.push({
                            ...promo,
                            availableCategories
                        })

                    })

                } else {
                    result = promoCodeData;
                }

                return {
                    status: 200,
                    result
                };
            } else {
                return {
                    status: 500,
                    errorMessage: 'Oops! It looks like you are not logged-in with your account. Please login and continue.'
                };
            }
        } catch (error) {
            return {
                status: 400,
                errorMessage: 'Oops! Something went wrong.' + error.message

            }
        }
    }
};

export default getPromoCode;

/*

query getPromoCode($bookingFare:Float!,$currency:String!){
  getPromoCode(bookingFare:$bookingFare,currency:$currency){
    status
    result{
      title
      code
      description
      promoValue
      expiryDate
      currency
      type
    }
    errorMessage
  }
}

*/