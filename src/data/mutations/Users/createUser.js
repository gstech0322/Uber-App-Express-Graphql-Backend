// GrpahQL
import {
    GraphQLString as StringType,
    GraphQLNonNull as NonNull,
    GraphQLInt as IntType,
    GraphQLFloat as FloatType,
} from 'graphql';

// Models
import {
    User,
    UserProfile,
    UserVerifiedInfo,
    EmailToken,
    UserLogin,
    Vehicles,
    AdminUser
} from '../../models';

import UserCommonType from '../../types/UserCommonType';

// Helpers
import {createJWToken} from '../../../libs/auth';

const createUser = {
    type: UserCommonType,

    args: {
        firstName: {type: StringType},
        lastName: {type: StringType},
        email: {type: new NonNull(StringType)},
        password: {type: new NonNull(StringType)},
        phoneDialCode: {type: new NonNull(StringType)},
        phoneNumber: {type: new NonNull(StringType)},
        phoneCountryCode: {type: new NonNull(StringType)},
        lat: {type: FloatType},
        lng: {type: FloatType},
        city: {type: StringType},
        state: {type: StringType},
        zipcode: {type: StringType},
        country: {type: StringType},
        vehicleName: {type: StringType},
        vehicleType: {type: IntType},
        vehicleNumber: {type: StringType},
        vehicleModel: {type: StringType},
        vehicleColor: {type: StringType},
        userType: {type: new NonNull(IntType)},
        deviceType: {type: new NonNull(StringType)},
        deviceDetail: {type: StringType},
        deviceId: {type: new NonNull(StringType)},
        preferredLanguage: {type: StringType}
    },

    async resolve({request, response}, {
        firstName,
        lastName,
        email,
        password,
        phoneDialCode,
        phoneNumber,
        phoneCountryCode,
        lat,
        lng,
        city,
        state,
        zipcode,
        country,
        vehicleName,
        vehicleType,
        vehicleNumber,
        vehicleModel,
        vehicleColor,
        userType,
        deviceType,
        deviceDetail,
        deviceId,
        preferredLanguage
    }) {
        try {
            const checkUser = await User.findOne({
                attributes: ['id', 'email'],
                where: {
                    $or: [
                        {
                            email
                        },
                        {
                            phoneNumber,
                            phoneDialCode
                        }
                    ],
                    deletedAt: null
                }
            });

            if (checkUser) {
                return {
                    errorMessage: 'User already exists',
                    status: 400
                };
            } else {
                const getAdminUserId = await AdminUser.findOne({
                    where: {
                        email
                    },
                });

                if (getAdminUserId) {
                    return {
                        errorMessage: 'User already exists',
                        status: 400
                    };
                } else {
                    let userStatus = (userType == 2) ? 'pending' : 'active';

                    // New User Creation
                    const newUser = await User.create({
                        email,
                        password: User.prototype.generateHash(password),
                        phoneNumber,
                        phoneDialCode,
                        phoneCountryCode,
                        userType,
                        userStatus,
                        profile: {
                            firstName,
                            lastName,
                            lat,
                            lng,
                            state,
                            city,
                            zipcode,
                            country,
                            preferredLanguage
                        },
                        userVerifiedInfo: {
                            isEmailConfirmed: false
                        },
                        emailToken: {
                            email,
                            token: Date.now()
                        }
                    }, {
                        include: [
                            {model: UserProfile, as: 'profile'},
                            {model: UserVerifiedInfo, as: 'userVerifiedInfo'},
                            {model: EmailToken, as: 'emailToken'}
                        ]
                    });

                    if (newUser) {
                        let userToken = await createJWToken(newUser.id, newUser.email, phoneNumber);

                        // Insert login token record with device infomation
                        const creatUserLogin = await UserLogin.create({
                            key: userToken,
                            userId: newUser.id,
                            deviceType,
                            deviceDetail,
                            deviceId
                        });

                        let user = await UserProfile.findOne({
                            where: {
                                userId: newUser.id,
                            },
                            raw: true
                        });

                        if (userType && userType == 2) {

                            const creatVehicles = await Vehicles.create({
                                userId: newUser.id,
                                vehicleName,
                                vehicleNumber,
                                vehicleModel,
                                vehicleColor,
                                vehicleType,
                                vehicleStatus: 'active' // For temp
                            });

                        }

                        return {
                            result: {
                                email: newUser.email,
                                userId: newUser.id,
                                phoneNumber: newUser.phoneNumber,
                                userToken,
                                user
                            },
                            status: 200,
                        };
                    } else {
                        return {
                            errorMessage: 'Something went wrong',
                            status: 400
                        }
                    }
                }
            }
        } catch (error) {
            return {
                errorMessage: 'Something went wrong! ' + error,
                status: 400
            }
        }
    }

};

export default createUser;

/*
mutation (
    $firstName: String,
    $lastName: String,
    $email: String!,
    $password: String!,
    $phoneDialCode: String!,
    $phoneNumber: String!,
    $phoneCountryCode: String!,
  	$lat: Float,
  	$lng: Float,
  	$city: String,
  	$state:String,
  	$zipcode: String,
    $country: String,
    $vehicleName: String,
    $vehicleType: Int,
    $vehicleNumber: String,
    $userType: Int!,
    $deviceType: String!,
    $deviceId: String!,
    $preferredLanguage: String
) {
    createUser (
        firstName: $firstName,
        lastName: $lastName,
        email: $email,
        password: $password,
        phoneDialCode: $phoneDialCode,
        phoneNumber: $phoneNumber,
        phoneCountryCode: $phoneCountryCode,
        lat: $lat,
        lng: $lng,
        city: $city,
        state: $state,
        zipcode: $zipcode,
        country: $country,
        vehicleName: $vehicleName,
        vehicleType: $vehicleType,
        vehicleNumber: $vehicleNumber,
        userType: $userType,
        deviceType: $deviceType,
        deviceId: $deviceId,
        preferredLanguage: $preferredLanguage
    ) {
        result {
            userId
            userToken
            user {
                firstName
                lastName
                phoneNumber
                preferredLanguage
                preferredCurrency
                status
                country
                createdAt
            }
        }
        status
        errorMessage
    }
}
*/