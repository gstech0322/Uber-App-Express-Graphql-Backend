// GrpahQL
import {
    GraphQLString as StringType,
    GraphQLNonNull as NonNull,
} from 'graphql';

import bcrypt from 'bcrypt';

// Models
import { User } from '../../models';

// Types
import UserCommonType from '../../types/UserCommonType';

const updateUserPassword = {

    type: UserCommonType,

    args: {
        oldPassword: { type: new NonNull(StringType) },
        newPassword: { type: new NonNull(StringType) },
    },

    async resolve({ request, response }, { oldPassword, newPassword }) {

        try {

            if (request.user) {

                const id = request.user.id;
                const email = request.user.email;

                const getUser = await User.findOne({
                    where: {
                        email
                    },
                    raw: true
                });

                if (getUser) {

                    if (bcrypt.compareSync(oldPassword, getUser.password)) {

                        // Validate Is user banned
                        if (getUser.isBan == 1) {
                            return {
                                errorMessage: 'Your account has blocked for some reason. If you need further information, please contact us.',
                                status: 500
                            };
                        } else {

                            // update password for the valid user
                            const updateUserPassword = await User.update({
                                password: User.prototype.generateHash(newPassword)
                            }, {
                                    where: {
                                        id: id,
                                    }
                                });

                            return {
                                result: {
                                    email: getUser.email,
                                    userId: getUser.id
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
                        errorMessage: "No account exists for " + email + ". Maybe you signed up using a different/incorrect e-mail address.",
                        status: 400
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
    }
};

export default updateUserPassword;

/*

mutation ($oldPassword: String!, $newPassword: String!) {
    updateUserPassword (oldPassword: $oldPassword, password: $password) {
        status
        errorMessage
    }
}

*/