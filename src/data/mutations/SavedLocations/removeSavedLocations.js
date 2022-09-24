import { User, SavedLocations } from '../../models';

import SavedLocationsType from '../../types/SavedLocationsType';

import {
    GraphQLInt as IntType
} from 'graphql';

const removeSavedLocations = {

    type: SavedLocationsType,

    args: {
        id: { type: IntType }
    },

    async resolve({ request }, {
        id
    }) {
        try {
            if (request.user) {
                let userId = request.user.id;

                const checkUserBan = await User.findOne({
                    where: {
                        id: userId,
                        isBan: true
                    }
                });

                if (checkUserBan) {
                    return await {
                        status: 500,
                        errorMessage: 'Oops! it looks like your account has been blocked. Please contact support.',
                    };
                } else {
                    const deleteSavedLocations = await SavedLocations.destroy({
                        where: {
                            userId,
                            id
                        }
                    });

                    if (deleteSavedLocations) {
                        return await {
                            status: 200
                        };
                    } else {
                        return await {
                            status: 400,
                            errorMessage: 'Oops! unable to save the location. Please try again'
                        };
                    }
                }
            } else {
                return {
                    status: 500,
                    errorMessage: 'Oops! it looks like you are not logged-in with your account. Please login to continue.',
                };
            }
        } catch (error) {
            return {
                status: 400,
                errorMessage: 'Something went wrong.' + error.message

            }
        }
    },
};

export default removeSavedLocations;

/*
        
mutation($id: Int) {
    removeSavedLocations(id: $id) {
        status
        errorMessage
    }
}

*/
