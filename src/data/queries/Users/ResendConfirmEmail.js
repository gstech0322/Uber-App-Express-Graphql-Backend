import {
    GraphQLList as List,
    GraphQLString as StringType,
    GraphQLNonNull as NonNull,
    GraphQLInt as IntType,
} from 'graphql';

import EmailTokenType from '../../types/EmailTokenType';
import { EmailToken, UserProfile, User, UserLogin } from '../../models';
import { sendEmail } from '../../../libs/sendEmail';
import getEmailTokenType from '../../types/getEmailTokenType';

const ResendConfirmEmail = {

    type: getEmailTokenType,

    async resolve({ request, response }) {

        let where, status = 200, errorMessage;
        let currentToken;

        try {
            if (request.user) {

                const userId = request.user.id;
                const email = request.user.email;
                let token = Date.now();                

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
                        id: request.user.id,
                        userDeletedAt: {
                            $eq: null
                        },
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

                    if (checkUser.userBanStatus == 1) {
                        return {
                            errorMessage: 'Your account has blocked for some reason. If you need further information, please contact us.',
                            status: 500
                        };
                    } else {

                        const checkEmailToken = await EmailToken.findOne({
                            where: {
                                userId,
                                email,
                            },
                        });

                        let user = await UserProfile.findOne({
                            where: {
                                userId: request.user.id,
                            },
                            raw: true
                        });

                        
                        if (checkEmailToken) {                            
                            let content = {
                                token: checkEmailToken.token,
                                email,
                                name: user.firstName
                            };

                            const { status, errorMessage } = await sendEmail(email, 'confirmEmail', content);

                            return {
                                // results: {
                                //     userId,
                                //     email,
                                //     token,
                                // },
                                results: checkEmailToken,
                                status: 200,
                            }
                            // return checkEmailToken;
                        } else {                            
                            const createEmailToken = await EmailToken.create({
                                userId,
                                email,
                                token
                            });

                            let user = await UserProfile.findOne({
                                where: {
                                    userId: request.user.id,
                                },
                                raw: true
                            });
                            if (createEmailToken) {                                
                                let content = {
                                    token,
                                    email,
                                    name: user.firstName
                                };

                                const { status, errorMessage } = await sendEmail(email, 'confirmEmail', content);

                                return {
                                    results: {
                                        userId,
                                        email,
                                        token,
                                    },
                                    status: 200,
                                }
                            } else {
                                return {
                                    errorMessage: 'Invalid email.',
                                    status: 400
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
                }
            }
        } catch (error) {
            return {
                errorMessage: 'Something went wrong.' + error,
                status: 400
            }
        }
    },
};

export default ResendConfirmEmail;