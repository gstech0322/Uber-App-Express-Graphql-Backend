import {
    GraphQLNonNull as NonNull,
    GraphQLFloat as FloatType,
    GraphQLInt as IntType
} from 'graphql';

import sequelize from '../../sequelize';

import { Category, UserProfile, PromoCode, Location, Pricing, CurrencyRates } from '../../models';

import TripResponseType from '../../types/TripResponseType';

import calculateTripCalculation from '../../../libs/calculateTripCalculation';

const tripCalculation = {

    type: TripResponseType,

    args: {
        totalDistance: { type: new NonNull(FloatType) },
        totalDuration: { type: FloatType },
        promoId: { type: IntType },
        lat: { type: new NonNull(FloatType) },
        lng: { type: new NonNull(FloatType) }
    },

    async resolve({ request }, { totalDistance, totalDuration, promoId, lat, lng }) {

        try {
            let result = [], promoCodeData, requestLocationPoint, contains;
            let permittedLocationsId, status = 200, errorMessage;
            let permittedPricing, getCategoryData, rates = {}, baseCurrency;
            let pricingAttributes = [
                'id', 'categoryId', 'unitPrice', 'minutePrice', 'basePrice', 'currency', 'riderFeeType',
                'riderFeeValue', 'driverFeeType', 'driverFeeValue', 'isActive', 'isSurgePrice'
            ];

            if (request.user) {
                let userId = request.user.id, convertCurrency;

                const profile = await UserProfile.findOne({
                    attributes: ['userId', 'preferredCurrency'],
                    where: {
                        userId
                    },
                    raw: true
                });

                if (!profile) {
                    status = 500;
                    errorMessage = 'Oops! it looks like something went wrong with your account.';
                }

                convertCurrency = status === 200 && profile && profile.preferredCurrency;

                if (promoId && status === 200) { // If Promocode supplied
                    promoCodeData = await PromoCode.findOne({
                        where: {
                            $and: [
                                { isEnable: true },
                                {
                                    expiryDate: {
                                        $or: [{
                                            $gte: new Date()
                                        }, {
                                            $eq: null
                                        }]
                                    }
                                },
                                { id: promoId }
                            ]
                        },
                        raw: true
                    });
                }

                if (status === 200) {
                    requestLocationPoint = sequelize.fn('GeomFromText', `POINT(${lat} ${lng})`);

                    contains = sequelize.fn('ST_CONTAINS',
                        sequelize.col(`geometryCoordinates`),
                        requestLocationPoint
                    );
                    // Check the location is within the service available range
                    const permittedLocations = await Location.findAll({
                        attributes: ['id'],
                        where: {
                            isActive: true,
                            and: sequelize.where(contains, 1)
                        },
                        raw: true
                    });

                    permittedLocationsId = permittedLocations && permittedLocations.map(x => { return x['id'] });
                    // Pull the pricing & allowed category information based on available locations
                    const permittedCategories = await Pricing.findAll({
                        attributes: pricingAttributes,
                        where: {
                            isActive: true,
                            locationId: {
                                $in: permittedLocationsId
                            }
                        },
                        order: [['updatedAt', 'DESC']],
                        raw: true
                    });

                    if (permittedLocations && permittedCategories) {
                        // Remove duplicate categories
                        permittedPricing = permittedCategories.filter((o, index) => { 
                            return permittedCategories.findIndex((x) => x.categoryId === o.categoryId) >= index 
                        });
                        // Get active categories
                        getCategoryData = await Category.findAll({
                            attributes: ['id', 'categoryName'],
                            where: {
                                isActive: true,
                            },
                            order: [['id', 'ASC']],
                            raw: true
                        });

                        if (permittedPricing && permittedPricing.length > 0 && getCategoryData) {
                            // Currency Rates & information
                            const currencyRatesData = await CurrencyRates.findAll({
                                attributes: ['currencyCode', 'rate', 'isBase'],
                                raw: true 
                            });

                            baseCurrency = currencyRatesData.find(o => o && o.isBase);
                            baseCurrency = baseCurrency.currencyCode;

                            currencyRatesData.map((item) => { rates[item.currencyCode] = item.rate });

                            await Promise.all(permittedPricing.map(async (item) => {
                                let pricingObj = {};
                                pricingObj = await calculateTripCalculation(item, getCategoryData, totalDistance, totalDuration, convertCurrency, promoCodeData, rates, baseCurrency);
                                result.push(pricingObj);
                            }));

                            result = result && result.length > 0 ? result.sort((a, b) => a['id'] - b['id']) : [];

                            return await {
                                status: 200,
                                result
                            };

                        } else {
                            return {
                                status: 400,
                                errorMessage: 'Sorry, our service unavailable in your location at the moment.',
                                result: []
                            };
                        }
                    } else {
                        return {
                            status: 400,
                            errorMessage: 'Sorry, our service unavailable in your location.',
                            result: []
                        };
                    }
                }

                return await {
                    status,
                    errorMessage
                };
            } else {
                return {
                    status: 500,
                    errorMessage: 'Please login with your account and try again.',
                };
            }
        } catch (error) {
            console.log('error', error);
            return {
                errorMessage: 'Something went wrong ' + error,
                status: 400,
                result: []
            };
        }
    },
};

export default tripCalculation;

/**

mutation tripCalculation($totalDistance: Float!, $totalDuration: Float, $promoId: Int, $lat: Float!, $lng: Float!) {
  tripCalculation (totalDistance: $totalDistance, totalDuration: $totalDuration, promoId: $promoId, lat: $lat, lng: $lng) {
    result {
      id
      categoryName
      pricingId
      unitPrice
      minutePrice
      basePrice
      currency
      riderFeeType
      riderFeeValue
      driverFeeType
      driverFeeValue
      riderServiceFee
      driverServiceFee
      priceForDistance
      priceForDuration
      totalFare
      calculatedPrice
      convertCurrency
      totalFareForRider
      totalFareForDriver
      isSpecialTrip
      specialTripPrice
      specialTripTotalFare
    }
    status
    errorMessage
  }
}


*/
