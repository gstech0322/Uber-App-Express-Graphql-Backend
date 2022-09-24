import { PromoCode } from '../../models';

import PromoCodeType from '../../types/PromoCodeType';

import {
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLNonNull as NonNull,
    GraphQLFloat as FloatType,
    GraphQLList as List
} from 'graphql';

const addPromoCode = {

    type: new List(PromoCodeType),

    args: {
        title: { type: new NonNull(StringType) },
        description: { type: new NonNull(StringType) },
        code: { type: new NonNull(StringType) },
        type: { type: IntType }, // // (1 => percentage, 2 => fixed)
        promoValue: { type: new NonNull(FloatType) },
        currency: { type: StringType },
        expiryDate: { type: StringType }
    },

    async resolve({ request }, {
        title,
        description,
        code,
        type,
        promoValue,
        currency,
        expiryDate
    }) {
        try {    
            const createPromoCode = await PromoCode.create({
                title,
                description,
                code,
                type,
                promoValue,
                currency,
                expiryDate
            });

            if (createPromoCode) {
                return await PromoCode.findAll({});
            } else {
                return await {
                    status: 400,
                    errorMessage: 'Oops! unable to create. Please try again'
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

export default addPromoCode;

/*
        
mutation( 
    $title: String!, 
    $description: String!, 
    $code: String!, 
    $type: Int!,
    $promoValue: Float!, 
    $currency: String,
    $expiryDate: String
) {
    addPromoCode(
        title: $title,
        description: $description,
        code: $code,
        type: $type,
        promoValue: $promoValue,
        currency: $currency,
        expiryDate: $expiryDate
    ) {
        id
        title
        description
        code
        type
        promoValue
        currency
        expiryDate
        isEnable
        createdAt
        updatedAt
    }
}

*/
