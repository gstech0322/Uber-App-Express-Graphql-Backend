import emailToken from '../../types/EmailTokenType';
import getEmailTokenType from '../../types/getEmailTokenType';
import { EmailToken, User, UserLogin, UserVerifiedInfo } from '../../../data/models';

import {
    GraphQLList as List,
    GraphQLString as StringType,
    GraphQLNonNull as NonNull,
    GraphQLInt as IntType,
} from 'graphql';

const EmailVerification = {

    type: getEmailTokenType,

    args: {
        token: { type: new NonNull(StringType) },
        email: { type: new NonNull(StringType) },
    },

    async resolve({ request, response }, { token, email }) {

        let where, status = 200, errorMessage;
        let currentToken;

        try {
            if (request.user) {
                currentToken = request.headers.auth;
                where = {
                    userId: request.user.id,
                    key: currentToken
                };

                // Check if the user is already exists
                const checkUser = await User.findOne({
                    attributes: ['id', 'email', 'type', 'userBanStatus'],
                    where: {
                        email,
                        userDeletedAt: {
                            $eq: null
                        },
                        id: request.user.id
                    },
                    order: [
                        [`createdAt`, `DESC`],
                    ],
                    raw: true
                });

                const checkLogin = await UserLogin.findOne({
                    attributes: ['id'],
                    where
                });

                if (checkLogin && checkUser) {
                    const userId = request.user.id;
                    if (checkUser.userBanStatus == 1) {
                        return {
                            errorMessage: 'Your account has blocked for some reason. If you need further information, please contact us.',
                            status: 500
                        };
                    } else {
                        const checkEmailConfirmation = await EmailToken.count({
                            where: {
                                email,
                                token,
                                userId: request.user.id
                            }
                        });

                        if (checkEmailConfirmation > 0) {
                            const updateVerifiedTable = await UserVerifiedInfo.update({
                                isEmailConfirmed: true
                            },
                                {
                                    where: {
                                        userId: request.user.id
                                    }
                                });
                            if (updateVerifiedTable) {
                                return {
                                    status: 200
                                }
                            }
                        } else {
                            if (request.user.email !== email) {
                                return {
                                    status: 400,
                                    errorMessage: 'Invalid email'
                                }
                            } else {
                                return {
                                    status: 400,
                                    errorMessage: 'Invalid token'
                                }
                            }
                        }
                    }
                } else {
                    return {
                        errorMessage: "Please login for this action.",
                        status: 500
                    };
                }
            } else {
                return {
                    errorMessage: "Please login for this action.",
                    status: 500
                };
            }
        } catch (error) {
            return {
                errorMessage: 'Something went wrong. ' + error,
                status: 400
            }
        }

    },
};

export default EmailVerification;

/**
 *
 * mutation EmailVerification(
    $token: String!,
    $email: String!,
){
    EmailVerification(
        token: $token,
        email: $email
    ) {
        status
    errorMessage
    }
}

 */