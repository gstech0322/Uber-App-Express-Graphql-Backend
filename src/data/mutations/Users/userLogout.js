// GrpahQL
import {
    GraphQLString as StringType,
    GraphQLNonNull as NonNull,
} from 'graphql';

// Models
import { UserLogin, User, Booking } from '../../models';

// Types
import UserType from '../../types/UserType';

const userLogout = {
    type: UserType,

    args: {
        deviceType: { type: new NonNull(StringType) },
        deviceId: { type: new NonNull(StringType) },
    },

    async resolve({ request, response }, {
        deviceType,
        deviceId
    }) {
        let where;

        try {
            if (request.user) {
                const userId = request.user.id;
                where = {
                    userId,
                    deviceType,
                    deviceId
                };

                const checkLogin = await UserLogin.findOne({
                    attributes: ['id'],
                    where
                });

                if (checkLogin) {
                    const findActiveBooking = await Booking.findOne({
                        attributes: ['id'],
                        where: {
                            tripStatus: {
                                $in: ['created','approved', 'started'],
                            },
                            $or: [
                                {
                                    riderId: userId
                                },
                                {
                                    driverId: userId
                                }
                            ],
                        },
                        raw: true
                    });

                    if (findActiveBooking) {
                        return {
                            status: 400,
                            errorMessage: 'Oops! Unable to logout your account. Please cancel or complete the ride to logout your account.'
                        };
                    }

                    await User.update({
                        activeStatus: 'inactive',
                        isActive: false
                    }, {
                        where: {
                            id: userId
                        }
                    });

                    await UserLogin.destroy({ where });

                    return {
                        status: 200
                    };
                } else {
                    return {
                        status: 500,
                        errorMessage: 'Oops! Something went wrong. Close your application and try again.',
                        
                    };
                }
            } else {
                return {
                    status: 400,
                    errorMessage: 'Oops! It looks like you are already logged out.'
                };
            }
        } catch (error) {
            return {
                status: 400,
                errorMessage: 'Oops! Something went wrong. ' + error
            }
        }
    }
};

export default userLogout;

/*

mutation (
    $deviceType: String!,
    $deviceId: String!) {
    userLogout (
        deviceType: $deviceType,        
        deviceId: $deviceId,
    ) {
        status
        errorMessage
    }
}

*/