import {
    User,
    SMSVerification,
    UserLogin,
    UserProfile
} from '../../models';
import VerifyPhoneNumberType from '../../types/VerifyPhoneNumberType';

import {
    GraphQLString as StringType,
    GraphQLNonNull as NonNull,
    GraphQLInt as IntType
} from 'graphql';

import { createJWToken } from '../../../libs/auth';

const verifyPhoneNumber = {

    type: VerifyPhoneNumberType,

    args: {
        phoneDialCode: { type: new NonNull(StringType) },
        phoneNumber: { type: new NonNull(StringType) },
        verificationCode: { type: new NonNull(IntType) },
        deviceId: { type: new NonNull(StringType) },
        deviceType: { type: new NonNull(StringType) },
        userType: { type: IntType },
        preferredLanguage: { type: StringType }
    },

    async resolve({ request }, { phoneDialCode, phoneNumber, verificationCode, deviceId, deviceType, userType, preferredLanguage }) {

        try {
            let checkUserType, registerUserType;

            const isValidCode = await SMSVerification.findOne({
                attributes: ['id'],
                where: {
                    phoneNumber,
                    phoneDialCode,
                    otp: verificationCode
                }
            });

            if (isValidCode) {
                const isUserExist = await User.findOne({
                    attributes: ['id', 'email', 'userType', 'isActive'],
                    where: {
                        phoneNumber,
                        phoneDialCode,
                        deletedAt: null
                    }
                });

                if (isUserExist) {
                    checkUserType = isUserExist && isUserExist.userType;
                    registerUserType = checkUserType == 1 ? 'rider' : 'driver';

                    if (userType != checkUserType) {
                        return {
                            errorMessage: 'Oops! it looks like you have already registered as a ' + registerUserType + ' with your phone number.',
                            status: 400
                        };
                    } else {
                        let userToken = await createJWToken(isUserExist.id, isUserExist.email, phoneNumber);
                        let where = {
                            userId: isUserExist.id
                        };

                        let deviceLoginExist = await UserLogin.findAll({
                            attributes: ['id'],
                            where
                        });

                        if (deviceLoginExist && deviceLoginExist.length > 0) {
                            const removeLogin = await UserLogin.destroy({
                                where
                            });

                            const creatUserLogin = await UserLogin.create({
                                key: userToken,
                                userId: isUserExist.id,
                                deviceType,
                                deviceId
                            });

                            let changeEverything = await User.update({
                                isActive: isUserExist.isActive
                            }, {
                                where: {
                                    id: isUserExist.id
                                }
                            });
                        } else {
                            // Insert login token record with device infomation
                            const creatUserLogin = await UserLogin.create({
                                key: userToken,
                                userId: isUserExist.id,
                                deviceType,
                                deviceId
                            });

                            let changeEverything = await User.update({
                                isActive: false
                            },
                                {
                                    where: {
                                        id: isUserExist.id
                                    }
                                });
                        }

                        if (preferredLanguage && preferredLanguage.toString() !== '') { // Update user preferred language
                            const updateUserLanguage = await UserProfile.update({
                                preferredLanguage
                            }, {
                                where: {
                                    userId: isUserExist.id
                                },
                            });
                        }

                        return await {
                            status: 200,
                            result: {
                                auth: userToken,
                                email: isUserExist.email,
                                userId: isUserExist.id,
                                phoneNumber,
                                phoneDialCode
                            }
                        };
                    }
                } else {
                    return {
                        status: 200,
                        result: {
                            auth: '',
                            email: '',
                            userId: '',
                            phoneNumber,
                            phoneDialCode
                        }
                    }
                }
            } else {
                return {
                    errorMessage: 'Unable to validate your phone number',
                    status: 400
                };
            }

        } catch (error) {
            return {
                errorMessage: 'Something went wrong ' + error,
                status: 400
            };
        }

    },
};

export default verifyPhoneNumber;

/**
mutation verifyPhoneNumber($phoneDialCode: String!, $phoneNumber: String!, $verificationCode: Int!, $deviceId: String!, $deviceType: String!, $userType: Int, $preferredLanguage: String) {
  verifyPhoneNumber(phoneDialCode: $phoneDialCode, phoneNumber: $phoneNumber, verificationCode: $verificationCode,deviceId: $deviceId, deviceType: $deviceType, userType: $userType, preferredLanguage: $preferredLanguage) {
    status
    errorMessage
    result {
        auth
        email
        userId
        phoneNumber
        phoneDialCode
    }
  }
}
 */
