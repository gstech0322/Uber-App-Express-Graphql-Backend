import { User, SavedLocations } from '../../models';

import SavedLocationsType from '../../types/SavedLocationsType';

import {
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLNonNull as NonNull,
    GraphQLFloat as FloatType
} from 'graphql';

const addSavedLocations = {

    type: SavedLocationsType,

    args: {
        id: { type: IntType },
        location: { type: new NonNull(StringType) },
        lat: { type: new NonNull(FloatType) },
        lng: { type: new NonNull(FloatType) },
        locationType: { type: new NonNull(StringType) },
        locationName: { type: StringType }
    },

    async resolve({ request }, {
        id,
        location,
        lat,
        lng,
        locationType,
        locationName
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
                    if (id) { // Update
                        const updateSavedLocations = await SavedLocations.update({
                            location,
                            lat,
                            lng,
                            locationType,
                            locationName
                        }, {
                            where: {
                                userId,
                                id
                            }
                        });

                        if (updateSavedLocations) {
                            return await {
                                id,
                                status: 200
                            };
                        } else {
                            return await {
                                status: 400,
                                errorMessage: 'Oops! unable to save the location. Please try again'
                            };
                        }
                    } else { // Create
                        const createSavedLocations = await SavedLocations.create({
                            userId,
                            location,
                            lat,
                            lng,
                            locationType,
                            locationName
                        });

                        if (createSavedLocations) {
                            return await {
                                id: createSavedLocations.dataValues.id,
                                status: 200
                            };
                        } else {
                            return await {
                                status: 400,
                                errorMessage: 'Oops! unable to save the location. Please try again'
                            };
                        }
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

export default addSavedLocations;

/*
        
mutation($id: Int, $location: String!, $lat: Float!, $lng: Float!, $locationType: String!, $locationName: String) {
    addSavedLocations(id: $id, location: $location, lat: $lat, lng: $lng, locationType: $locationType, locationName: $locationName) {
        status
        errorMessage
    }
}

*/
