// GrpahQL
import {
    GraphQLString as StringType,
    GraphQLNonNull as NonNull,
} from 'graphql';

// Models
import { UserLogin, UserProfile, CurrencyRates } from '../../models';

// Types
import UserType from '../../types/UserType';

import { convert } from '../../../helpers/currencyConvertion';

const userUpdate = {

    type: UserType,

    args: {
        userId: { type: new NonNull(StringType) },
        fieldName: { type: new NonNull(StringType) },
        fieldValue: { type: StringType },
        deviceType: { type: new NonNull(StringType) },
        deviceId: { type: new NonNull(StringType) },
        // phoneNumber: { type: new NonNull(StringType) }
    },

    async resolve({ request, response }, {
        userId,
        fieldName,
        fieldValue,
        deviceType,
        deviceId,
        // phoneNumber
    }) {
        let where, status = 200, errorMessage;
        let userToken, currentToken;

        let userProfileData, existingPreferredCurrency, walletBalance, ratesData = {};
        let updateUser;

        try {
            if (request.user) {
                currentToken = request.headers.auth;

                const email = request.user.email;

                where = {
                    userId,
                    deviceType,
                    deviceId,
                    key: currentToken
                };

                const checkLogin = await UserLogin.findOne({
                    attributes: ['id'],
                    where
                });

                if (checkLogin && request.user.id === userId) {
                    
                    if (fieldName === 'preferredCurrency') { // To update Wallet amount value for currency changes
                        userProfileData = await UserProfile.findOne({
                            attributes: ['preferredCurrency', 'walletBalance'],
                            where: {
                                userId
                            },
                            raw: true
                        });

                        existingPreferredCurrency = userProfileData && userProfileData.preferredCurrency;
                        
                        if (fieldValue !== existingPreferredCurrency) {
                            const currencyRates = await CurrencyRates.findAll({ 
                                attributes: ['currencyCode', 'rate', 'isBase'],
                                raw: true 
                            });

                            const baseCurrency = currencyRates.find(o => o && o.isBase);

                            currencyRates.map((item) => { ratesData[item.currencyCode] = item.rate });

                            walletBalance = convert(
                                baseCurrency.currencyCode,
                                ratesData,
                                userProfileData.walletBalance,
                                existingPreferredCurrency,
                                fieldValue
                            );
                        } else {
                            walletBalance = userProfileData.walletBalance;
                        }

                        updateUser = await UserProfile.update(
                            {
                                [fieldName]: fieldValue,
                                walletBalance
                            },
                            {
                                where: {
                                    userId: request.user.id
                                }
                            }
                        );
                    } else { // Other settings
                        updateUser = await UserProfile.update(
                            {
                                [fieldName]: fieldValue
                            },
                            {
                                where: {
                                    userId: request.user.id
                                }
                            }
                        );
                    }

                    if (updateUser) {
                        status = 200;
                    } else {
                        status = 400;
                        errorMessage = fieldName + ' value unable to update'
                    }

                    return await {
                        status,
                        errorMessage,
                        userToken
                    };
                } else {
                    return {
                        errorMessage: "You haven't authorized for this action.",
                        status: 500,
                        userToken
                    };
                }
            } else {
                return {
                    errorMessage: "Please login for this action.",
                    status: 500,
                    userToken
                };
            }
        } catch (error) {
            return {
                errorMessage: 'Something went wrong. ' + error,
                status: 400,
                userToken
            }
        }
    }
};

export default userUpdate;

/*

mutation (
   $userId: String!,
   $fieldName: String!,
   $fieldValue: String,
   $deviceType: String!,
   $deviceId: String!,
   $phoneNumber: String!) {
   userUpdate (
       userId: $userId,
       fieldName: $fieldName,
       fieldValue: $fieldValue,
       deviceType: $deviceType,
       deviceId: $deviceId,
       phoneNumber: $phoneNumber
   ) {
       status
       userToken
       errorMessage
   }
}

*/