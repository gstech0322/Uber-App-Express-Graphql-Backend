// GrpahQL
import {
    GraphQLString as StringType,
    GraphQLNonNull as NonNull,
} from 'graphql';

// Models
import { ForgotPassword, User, UserProfile } from '../../models';

// Types
import UserType from '../../types/UserType';

// Email
import { sendEmail } from '../../../libs/sendEmail';

const userForgotPassword = {
    type: UserType,

    args: {
        email: { type: new NonNull(StringType) }
    },

    async resolve({ request, response }, { email }) {
        let userId, content, token = Date.now(), forgotLink;

        try {
            if (request.user) {
                return {
                    errorMessage: "Currently, you are logged in.",
                    status: 400
                };
            } else {
                const getUser = await User.findOne({
                    where: {
                        email
                    },
                    raw: true
                });

                if (getUser) {
                    userId = getUser.id;
                    const userProfileData = await UserProfile.findOne({
                        attributes: ['firstName'],
                        where: {
                            userId
                        },
                        raw: true
                    })
                    const deleteOldToken = await ForgotPassword.destroy({
                        where: {
                            email,
                            userId
                        }
                    });
                    const createNewToken = await ForgotPassword.create({
                        email,
                        userId,
                        token
                    });
                    if (createNewToken) {
                        content = {
                            token,
                            email,
                            name: userProfileData.firstName 
                        };

                        forgotLink = '/password/verification?token='+token+'&email='+email;
                        const { status, errorMessage } = await sendEmail(email, 'forgotPasswordLink', content);
    
                        return {
                            status: 200,
                            forgotLink
                        }
                    } else {
                        return { 
                            errorMessage: 'Unable to sent you forgot password link. Please try again.',
                            status: 400
                        }
                    }
                } else {
                    return {
                        errorMessage: "No account exists for " + email + ". Maybe you signed up using a different/incorrect e-mail address.",
                        status: 400
                    };
                }
            }
        } catch (error) {
            return {
                errorMessage: 'Something went wrong.' + error,
                status: 400
            }
        }
    }
};

export default userForgotPassword;

/*

mutation ($email: String!) {
    userForgotPassword (email: $email) {
        status
        forgotLink
        errorMessage
    }
}

*/