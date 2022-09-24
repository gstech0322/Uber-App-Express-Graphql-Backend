import {
    User,
    SavedLocations
} from '../../models';

import SavedLocationsCommonType from '../../types/SavedLocationsCommonType';


const getAllSavedLocations = {

    type: SavedLocationsCommonType,

    async resolve({ request }) {
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
                    let result = await SavedLocations.findAll({
                        where: {
                            userId
                        }
                    });
    
                    return await {
                        result,
                        status: 200
                    };
                }
            } else {
                return await {
                    status: 500,
                    errorMessage: 'Oops! it looks like you are not logged in with your account. Please login and continue.'
                }
            }
        } catch (error) {
            return {
                errorMessage: 'Something went wrong ' + error,
                status: 400
            };
        }

    },
};

export default getAllSavedLocations;

/**
query {
  getAllSavedLocations {
    result {
        id
        userId
        location
        lat
        lng
        locationType
        locationName
    }
    status
    errorMessage
  }
}

 */
