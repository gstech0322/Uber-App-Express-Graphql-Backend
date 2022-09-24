import UserAccountType from '../../types/userAccountType';
import { User, UserLogin } from '../../models';

import {
    GraphQLNonNull as NonNull,
    GraphQLFloat as FloatType,
} from 'graphql';

const updateDriverLocation = {

    type: UserAccountType,

    args: {
        lat: { type: new NonNull(FloatType) },
        lng: { type: new NonNull(FloatType) }
    },

    async resolve({ request }, { lat, lng }) {

        let currentToken, where;

        try {

            if (request.user) {
                let userId = request.user.id;

                currentToken = request.headers.auth;
                where = {
                    userId: request.user.id,
                    key: currentToken
                };

                const checkLogin = await UserLogin.findOne({
                    attributes: ['id'],
                    where
                });

                if (checkLogin) {

                    const updateDriverCurrentLocation = await User.update({
                        lat,
                        lng
                    },
                        {
                            where: {
                                id: userId
                            }
                        });

                    if (updateDriverCurrentLocation) {
                        return {
                            status: 200
                        };
                    } else {
                        return {
                            status: 400,
                            errorMessage: "Unable to update the location."
                        };
                    }

                } else {
                    return {
                        errorMessage: "You haven't authorized for this action.",
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

export default updateDriverLocation;

/**
mutation updateDriverLocation($lat: Float!, $lng: Float!) {
  updateDriverLocation(lat: $lat, lng: $lng) {
    status
    errorMessage
  }
}
 */
