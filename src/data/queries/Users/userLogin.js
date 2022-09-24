// GrpahQL
import {
    GraphQLString as StringType,
    GraphQLNonNull as NonNull,
} from 'graphql';

// Models
import { User, UserLogin, UserProfile } from '../../models';

// Types
import UserType from '../../types/UserType';

import UserCommonType from '../../types/UserCommonType';

// Helpers
import bcrypt from 'bcrypt';
import { createJWToken } from '../../../libs/auth';

const userLogin = {
    type: UserCommonType,

    args: {
        email: { type: new NonNull(StringType) },
        password: { type: new NonNull(StringType) },
        deviceType: { type: new NonNull(StringType) },
        deviceDetail: { type: StringType },
        deviceId: { type: new NonNull(StringType) },
    },

    async resolve({ request, response }, {
        email,
        password,
        deviceType,
        deviceDetail,
        deviceId
    }) {


        try {
            if (!request.user) {
                // Check if the user is already exists
                const checkUser = await User.findOne({
                    attributes: ['id', 'email', 'password', 'userBanStatus'],
                    where: {
                        email,
                        userDeletedAt: {
                            $eq: null
                        },
                    },
                    order: [
                        [`createdAt`, `DESC`],
                    ],
                });

                if (checkUser) {
                    // Validate Password
                    if (bcrypt.compareSync(password, checkUser.password)) {
                        // Validate Is user banned
                        if (checkUser.userBanStatus == 1) {
                            return {
                                errorMessage: 'Your account has blocked for some reason. If you need further information, please contact us.',
                                status: 500
                            };
                        } else {
                            let userToken = await createJWToken(checkUser.id, checkUser.email);
                            let where = {
                                userId: checkUser.id,
                                deviceId,
                                deviceType
                            };

                            let deviceLoginExist = await UserLogin.findOne({
                                where
                            });

                            if (deviceLoginExist) {
                                // update login token record with device infomation
                                const updateUserLogin = await UserLogin.update({
                                    key: userToken,
                                    userId: checkUser.id,
                                    deviceType,
                                    deviceDetail,
                                    deviceId
                                }, {
                                        where
                                    });
                            } else {
                                // Insert login token record with device infomation
                                const creatUserLogin = await UserLogin.create({
                                    key: userToken,
                                    userId: checkUser.id,
                                    deviceType,
                                    deviceDetail,
                                    deviceId
                                });
                            }

                            let user = await UserProfile.findOne({
                                where: {
                                    userId: checkUser.id,
                                },
                                raw: true
                            });

                            return {
                                result: {
                                    email: checkUser.email,
                                    userId: checkUser.id,
                                    userToken,
                                    user
                                },
                                status: 200,

                            };
                        }
                    } else {
                        return {
                            errorMessage: 'The password you entered is incorrect.',
                            status: 400
                        };
                    }
                } else {
                    return {
                        errorMessage: 'Invalid email.',
                        status: 400
                    };
                }
            } else {
                return {
                    errorMessage: 'You have already logged in.',
                    status: 400
                };
            }
        } catch (error) {
            return {
                errorMessage: 'Something went wrong.' + error,
                status: 400
            }
        }
    }
};

export default userLogin;

/*

query (
    $email: String!,
    $password: String!,
    $deviceType: String!,
    $deviceDetail: String,
    $deviceId: String!) {
    userLogin (
        email: $email,
        password: $password,
        deviceType: $deviceType,
        deviceDetail: $deviceDetail,
        deviceId: $deviceId,
    ) {
        userId
        userToken
        status
        errorMessage
    }
}

*/