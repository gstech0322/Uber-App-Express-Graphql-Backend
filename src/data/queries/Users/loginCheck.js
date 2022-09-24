// GrpahQL
import {
    GraphQLString as StringType,
    GraphQLNonNull as NonNull,
} from 'graphql';

// Models
import { User, UserLogin } from '../../models';

// Types
import UserCommonType from '../../types/UserCommonType';

const loginCheck = {
    type: UserCommonType,

    args: {
        userId: { type: new NonNull(StringType) }
    },

    async resolve({ request, response }, {
        userId
    }) {

        try {
            // Check if the user is already exists
            const checkUser = await User.findOne({
                attributes: ['id'],
                where: {
                    id: userId,
                    deletedAt: null,
                    isBan: {
                        $ne: true
                    }
                },
                order: [
                    [`createdAt`, `DESC`],
                ]
            });

            if (checkUser) {
                let loggedInDevice = await UserLogin.findOne({
                    attributes: ['userId', 'deviceType', 'deviceId'],
                    where: {
                        userId
                    },
                    raw: true
                });

                return await {
                    result: {
                        userId: (loggedInDevice && loggedInDevice.userId) || userId,
                        deviceId: loggedInDevice && loggedInDevice.deviceId,
                        deviceType: loggedInDevice && loggedInDevice.deviceType
                    },
                    status: 200
                }
            } else {
                return {
                    errorMessage: 'Oops! something went wrong. Please try again.',
                    status: 500
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

export default loginCheck;

/*

query ($userId: String!) {
    loginCheck (
        userId: $userId
    ) {
        result {
          userId
        	deviceType
        	deviceId
        }
        status
        errorMessage
    }
}

*/