// GrpahQL
import {
    GraphQLString as StringType,
    GraphQLNonNull as NonNull,
} from 'graphql';

// Models
import { ForgotPassword, User } from '../../models';

// Types
import UserType from '../../types/UserType';

const updateForgotPassword = {
    type: UserType,

    args: {
        email: { type: new NonNull(StringType) },
        password: { type: new NonNull(StringType) },
        token: { type: new NonNull(StringType) },
    },

    async resolve({ request, response }, { email, password, token }) {
        let userId;

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

                    const getForgotPassword = await ForgotPassword.findOne({
                        attributes: ['id'],
                        where: {
                            email,
                            token
                        }
                    });

                    if (getForgotPassword) {
                        const passwordUpdate = await User.update({
                            password: User.prototype.generateHash(password)
                        }, {
                                where: {
                                    id: userId
                                }
                            });

                        const deleteOldToken = await ForgotPassword.destroy({
                            where: {
                                email
                            }
                        });

                        if (passwordUpdate) {
                            return {
                                status: 200
                            }
                        } else {
                            return {
                                errorMessage: 'Unable update your new password. Please try again.',
                                status: 400
                            }
                        }
                    } else {
                        return {
                            status: 500,
                            errorMessage: 'You have not authorized for this action.'
                        };
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

export default updateForgotPassword;

/*

mutation ($email: String!, $password: String!, $token: String!) {
    updateForgotPassword (email: $email, password: $password, token: $token) {
        status
        errorMessage
    }
}

*/