import {
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLNonNull as NonNull
} from 'graphql';

import sequelize from '../../sequelize';

import { User, PromoCode } from '../../models';

import PromoCodeType from '../../types/PromoCodeType';

const validatePromoCode = {

    type: PromoCodeType,

    args: {
        code: { type: new NonNull(StringType) },
        id: { type: IntType }
    },

    async resolve({ request }, {
        code,
        id
    }) {
        try {    
            if (request.user) {
                let userId = request.user.id;
                let promoIdFilter = {}, alreadyUsedFilter = {};

                let userData = await User.findOne({
                    attributes: ['id', 'isBan'],
                    where: {
                        id: userId,
                        userType: 1,
                        deletedAt: null
                    },
                    raw: true
                });

                if (userData && !userData.isBan) { // Valid Rider user

                    if (id) {
                        promoIdFilter = { id };
                        alreadyUsedFilter = {
                            id: {
                                $notIn: [
                                    sequelize.literal(`SELECT promoCodeId FROM Booking WHERE promoCodeId=${id} AND riderId="${userId}" AND isSpecialTrip=1`)
                                ]
                            }
                        };
                    } else {
                        alreadyUsedFilter = {
                            id: {
                                $notIn: [
                                    sequelize.literal(`SELECT promoCodeId FROM Booking WHERE riderId="${userId}" AND isSpecialTrip=1`)
                                ]
                            }
                        };
                    }

                    const validateRequestCode = await PromoCode.findOne({
                        attributes: ['id', 'code'],
                        where: {
                            $and: [
                                { isEnable: true },
                                { code },
                                { 
                                    expiryDate: {
                                        $or: [{
                                            $gte: new Date() 
                                        }, {
                                            $eq: null
                                        }]
                                    }
                                },
                                promoIdFilter,
                                alreadyUsedFilter
                            ]
                        },
                        raw: true
                    });

                    if (validateRequestCode && validateRequestCode.code === code) {
                        return await {
                            id: validateRequestCode && validateRequestCode.id,
                            status: 200
                        };
                    } else {
                        return await {
                            status: 400,
                            errorMessage: 'Oops! it looks like you provided code is invalid.'
                        };
                    }
                } else {
                    return await {
                        status: 500,
                        errorMessage: 'Oops! It looks like something went wrong with your account. Please login again and continue.'
                    };
                }
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
    },
};

export default validatePromoCode;

/*
        
mutation( 
    $code: String!, 
    $id: Int
) {
    validatePromoCode(
        code: $code,
        id: $id
    ) {
        status
        errorMessage
    }
}

*/
