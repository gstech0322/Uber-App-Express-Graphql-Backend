// GrpahQL
import {
    GraphQLString as StringType,
    GraphQLNonNull as NonNull,
} from 'graphql';

// Models
import { UserLogin, UserProfile, User, AdminUser } from '../../models';

// Types
import UserType from '../../types/UserType';

import { createJWToken } from '../../../libs/auth';

const userUpdateCommon = {
    type: UserType,

    args: {
        userId: { type: new NonNull(StringType) },
        deviceType: { type: new NonNull(StringType) },
        deviceId: { type: new NonNull(StringType) },
        firstName: { type: StringType },
        lastName: { type: StringType },
        gender: { type: StringType },
        location: { type: StringType },
        dateOfBirth: { type: StringType },
    },

    async resolve({ request, response }, {
        userId,
        deviceType,
        deviceId,
        firstName,
        lastName,
        gender,
        location,
        dateOfBirth

    }) {
        let where, status = 200, errorMessage, convertedName, displayName;
        let userToken, currentToken;

        try {
            if (request.user) {
                currentToken = request.headers.auth;
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
                            displayName = firstName + ' ' + lastName; 

                            const updateProfile = await UserProfile.update(
                                {
                                    firstName: firstName,
                                    lastName: lastName,
                                    displayName: displayName,
                                    gender: gender,
                                    location: location,
                                    dateOfBirth: dateOfBirth

                                },
                                {
                                    where: {
                                        userId: request.user.id
                                    }
                                }
                            );

                            if (updateProfile) {
                                return{
                                    status : 200
                                }
                                
                            } else {
                                return {
                                    status : 400,
                                    errorMessage : 'Unable to update'
                                }
                                
                            }
                       
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
                errorMessage: 'Something went wrong.' + error,
                status: 400,
                userToken
            }
        }
    }
};

export default userUpdateCommon;

