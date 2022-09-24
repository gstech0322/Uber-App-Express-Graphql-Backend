import UserAccountType from '../../types/userAccountType';
import { User } from '../../models';

import {
    GraphQLBoolean as BooleanType,
    GraphQLNonNull as NonNull,
    GraphQLFloat as FloatType,
} from 'graphql';

const updateDriverstatus = {

    type: UserAccountType,

    args: {
        isActive: { type: new NonNull(BooleanType) },
        lat: { type: FloatType },
        lng: { type: FloatType }
    },

    async resolve({ request }, { isActive, lat, lng }) {

        try {

            if (request.user) {
                let userId = request.user.id;

                let activeStatus;

                if (isActive) {
                    activeStatus = 'active';
                }

                const updateDriverActiveStatus = await User.update({
                    isActive,
                    lat,
                    lng,
                    activeStatus
                },
                    {
                        where: {
                            id: userId
                        }
                    });

                if (updateDriverActiveStatus) {
                    return {
                        status: 200
                    };
                } else {
                    return {
                        status: 400,
                        errorMessage: "Unable to update the status."
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

export default updateDriverstatus;

/**
mutation updateDriverstatus($isActive: String!) {
  updateDriverstatus(isActive: $isActive) {
    status
    errorMessage
  }
}
 */
