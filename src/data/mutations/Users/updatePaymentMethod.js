import UserAccountType from '../../types/userAccountType';
import { UserProfile, User, UserLogin } from '../../models';

import {
    GraphQLNonNull as NonNull,
    GraphQLInt as IntType,
} from 'graphql';

const updatePaymentMethod = {

    type: UserAccountType,

    args: {
        paymentMethodId: { type: new NonNull(IntType) }
    },

    async resolve({ request }, { paymentMethodId }) {

        try {

            if (request.user) {
                let userId = request.user.id, currentToken, where;
                currentToken = request.headers.auth;

                where = {
                    userId: request.user.id,
                    key: currentToken
                };

                const isUserExist = await User.findOne({
                    attributes: ['id'],
                    where: {
                        id: userId
                    }
                });

                const checkLogin = await UserLogin.findOne({
                    attributes: ['id'],
                    where
                });

                if (isUserExist && checkLogin) {
                    const updatePaymentMethod = await UserProfile.update({
                        preferredPaymentMethod: paymentMethodId
                    }, {
                        where: {
                            userId
                        }
                    });

                    if (updatePaymentMethod) {
                        return {
                            status: 200
                        };
                    } else {
                        return {
                            status: 400,
                            errorMessage: "Unable to update."
                        };
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
                errorMessage: 'Something went wrong ' + error,
                status: 400
            };
        }

    },
};

export default updatePaymentMethod;

/**
mutation updatePaymentMethod($paymentMethodId: Int!) {
  updatePaymentMethod(paymentMethodId: $paymentMethodId) {
    status
    errorMessage
  }
}
 */
